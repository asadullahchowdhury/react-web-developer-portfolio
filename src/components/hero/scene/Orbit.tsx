import { useLayoutEffect, useMemo, useRef } from 'react';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type Group,
  type InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Matrix4,
  type Mesh,
  Quaternion,
  Vector3,
} from 'three';
import { COLORS, type NodeId, NODES, WORLD } from './config';
import { ellipsePoints, orbitPoint, roundedBoxGeometry, roundedSquareOutline } from './geometry';
import { sceneState } from './sceneState';

/** Packet start angles, evenly spaced (spec §9.2). */
const PACKET_ANGLES = [20, 140, 260] as const;
/** Packet speed in revolutions per second (spec §9.2). */
const PACKET_SPEED = 0.08;
/** Node dot pulse: 70–100% emissive, 3 s period, staggered (spec §9.2). */
const PULSE = { min: 0.7, period: 3 };
/** Node hover (spec §10): emissive +40%, its orbit segment to 45% opacity. */
const HOVER = { emissive: 0.4, arcOpacity: 0.45, arcHalfAngle: 16, smoothing: 14 };
/**
 * Scroll light-up (spec §11.1): each node lights at its pin progress, in
 * data-flow order, and the packet path into it brightens.
 */
const SCROLL_LIGHT = { at: [0.1, 0.17, 0.24, 0.31], ramp: 0.03, pathOpacity: 0.45 };
/** Label colour on hover: --text-tertiary → --text-primary. */
const LABEL_RGB = { rest: [122, 131, 150], hover: [237, 239, 243] } as const;

/** Label offset from the projected node centre, in CSS px (artboard 01). */
const LABEL_GAP = { above: 18, below: 24 } as const;

const IDENTITY = new Quaternion();

/** Arc of the orbit from one angle to another, in the orbit's local plane. */
function orbitArc(fromDeg: number, toDeg: number): Line {
  const { rx, rz } = WORLD.orbit;
  const positions: number[] = [];
  const steps = Math.max(8, Math.round(Math.abs(toDeg - fromDeg) / 2));
  for (let k = 0; k <= steps; k++) {
    const deg = fromDeg + (k / steps) * (toDeg - fromDeg);
    const a = (deg * Math.PI) / 180;
    positions.push(Math.cos(a) * rx, 0, -Math.sin(a) * rz);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const arc = new Line(
    geometry,
    new LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: 0, depthWrite: false }),
  );
  arc.visible = false;
  return arc;
}

/**
 * Orbit ellipse, the four system nodes, data packets, node hover, and the
 * DOM labels' screen positions (spec §7.1, §7.3, §8 #6–9, §9, §10).
 */
const Orbit = ({ interactive }: { interactive: boolean }) => {
  const { orbit, node, packets } = WORLD;
  const invalidate = useThree((s) => s.invalidate);
  const system = useRef<Group>(null);
  const bodies = useRef<InstancedMesh>(null);
  const dots = useRef<InstancedMesh>(null);
  const packetRefs = useRef<(Mesh | null)[]>([]);
  const travel = useRef(0);
  const highlight = useRef<Record<NodeId, number>>({ interface: 0, api: 0, services: 0, database: 0 });

  const nodePositions = useMemo(() => NODES.map((n) => orbitPoint(n.angle)), []);

  const { orbitLine, outlines, arcs, paths, boxGeometry } = useMemo(() => {
    const line = new Line(
      ellipsePoints(orbit.rx, orbit.rz, orbit.segments),
      new LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: orbit.opacity, depthWrite: false }),
    );
    line.name = 'orbit-line';

    // One outline per node so each can fade in on its own
    const outline = roundedSquareOutline(node.size, node.radius);
    const edges = nodePositions.map((p, i) => {
      const positions: number[] = [];
      for (let k = 0; k < outline.length; k += 3) {
        positions.push(outline[k], outline[k + 1], outline[k + 2] + node.size / 2 + 0.002);
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      const segments = new LineSegments(
        geometry,
        new LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: 0, depthWrite: false }),
      );
      segments.position.copy(p);
      segments.name = `node-edge-${NODES[i].id}`;
      return segments;
    });

    const nodeArcs = NODES.map((n) => {
      const arc = orbitArc(n.angle - HOVER.arcHalfAngle, n.angle + HOVER.arcHalfAngle);
      arc.name = `orbit-arc-${n.id}`;
      return arc;
    });

    // Data paths: interface → api → services → database runs clockwise
    // (decreasing angle) on this orbit
    const dataPaths = NODES.slice(1).map((n, i) => {
      const from = NODES[i].angle;
      let to = n.angle;
      while (to > from) to -= 360;
      const path = orbitArc(from, to);
      path.name = `orbit-path-${NODES[i].id}-${n.id}`;
      return path;
    });

    return {
      orbitLine: line,
      outlines: edges,
      arcs: nodeArcs,
      paths: dataPaths,
      boxGeometry: roundedBoxGeometry(node.size, node.radius),
    };
  }, [orbit, node, nodePositions]);

  // Instance colours must exist before the first frame
  useLayoutEffect(() => {
    const black = new Color(0, 0, 0);
    NODES.forEach((_, i) => {
      bodies.current?.setColorAt(i, black);
      dots.current?.setColorAt(i, black);
    });
  }, []);

  // Scratch objects reused every frame
  const tmp = useMemo(
    () => ({
      matrix: new Matrix4(),
      scale: new Vector3(),
      pos: new Vector3(),
      color: new Color(),
      voidColor: new Color(COLORS.void),
      graphite: new Color(COLORS.graphite),
      dotColor: new Color(COLORS.signalSoft),
      projected: new Vector3(),
    }),
    [],
  );

  const lit = useRef<number[]>([0, 0, 0, 0]);

  useFrame(({ camera, size, clock }, delta) => {
    const { intro, motion, scrollProgress } = sceneState;
    const t = clock.elapsedTime;
    const step = Math.min(delta, 0.1);

    // Orbit line draws on
    const points = Math.round(intro.orbit * orbit.segments) + 1;
    orbitLine.geometry.setDrawRange(0, intro.orbit > 0 ? points : 0);

    NODES.forEach((n, i) => {
      const reveal = intro.nodes[n.id];

      // Lit by scroll (spec §11.1) or hover (§10); eases toward its goal,
      // instantly with reduced motion
      const at = SCROLL_LIGHT.at[i];
      lit.current[i] = MathUtils.smoothstep(scrollProgress, at, at + SCROLL_LIGHT.ramp);
      const goal = Math.max(sceneState.hovered === n.id ? 1 : 0, lit.current[i]);
      const prev = highlight.current[n.id];
      const h = motion ? prev + (goal - prev) * (1 - Math.exp(-HOVER.smoothing * step)) : goal;
      highlight.current[n.id] = h;
      const lift = 1 + HOVER.emissive * h;

      // Scale 0.6 → 1 and fade in; dots pulse once revealed
      const s = reveal > 0 ? 0.6 + 0.4 * reveal : 0;
      const p = nodePositions[i];
      tmp.scale.setScalar(s);
      bodies.current?.setMatrixAt(i, tmp.matrix.compose(p, IDENTITY, tmp.scale));
      bodies.current?.setColorAt(i, tmp.color.copy(tmp.voidColor).lerp(tmp.graphite, reveal).multiplyScalar(lift));

      tmp.pos.set(p.x, p.y, p.z + (node.size / 2 + 0.006) * s);
      dots.current?.setMatrixAt(i, tmp.matrix.compose(tmp.pos, IDENTITY, tmp.scale));
      const pulse = motion
        ? PULSE.min + (1 - PULSE.min) * (0.5 + 0.5 * Math.sin((t / PULSE.period) * Math.PI * 2 - i * (Math.PI / 2)))
        : 1;
      dots.current?.setColorAt(i, tmp.color.copy(tmp.dotColor).multiplyScalar(pulse * reveal * lift));

      const edge = outlines[i];
      edge.visible = reveal > 0;
      edge.scale.setScalar(Math.max(s, 0.0001));
      (edge.material as LineBasicMaterial).opacity = Math.min(1, node.edgeOpacity * reveal * lift);

      const arc = arcs[i];
      arc.visible = h > 0.001;
      (arc.material as LineBasicMaterial).opacity = HOVER.arcOpacity * h;
    });
    // Path into a node brightens as that node lights up
    paths.forEach((path, i) => {
      const glow = lit.current[i + 1];
      path.visible = glow > 0.001;
      (path.material as LineBasicMaterial).opacity = SCROLL_LIGHT.pathOpacity * glow;
    });

    for (const mesh of [bodies.current, dots.current]) {
      if (!mesh) continue;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // Packets appear, then travel along the orbit
    if (motion && intro.packets > 0) travel.current += step * PACKET_SPEED;
    packetRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      // Travel in data-flow direction (clockwise, decreasing angle)
      orbitPoint(PACKET_ANGLES[i] - travel.current * 360, mesh.position);
      mesh.visible = intro.packets > 0;
      mesh.scale.setScalar(Math.max(intro.packets, 0.0001));
    });

    // Labels follow their nodes through the parallax-rotated scene root.
    // useFrame runs before the renderer refreshes world matrices.
    camera.updateMatrixWorld();
    system.current?.updateWorldMatrix(true, false);
    const [r0, g0, b0] = LABEL_RGB.rest;
    const [r1, g1, b1] = LABEL_RGB.hover;
    NODES.forEach((n, i) => {
      const el = sceneState.labels[n.id];
      if (!el) return;
      tmp.projected.copy(nodePositions[i]);
      if (system.current) tmp.projected.applyMatrix4(system.current.matrixWorld);
      tmp.projected.project(camera);
      const x = (tmp.projected.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.projected.y * 0.5 + 0.5) * size.height;
      el.style.opacity = String(intro.nodes[n.id]);
      el.style.transform =
        n.labelSide === 'above'
          ? `translate(${x}px, ${y - LABEL_GAP.above}px) translate(-50%, -100%)`
          : `translate(${x}px, ${y + LABEL_GAP.below}px) translate(-50%, 0)`;
      const h = highlight.current[n.id];
      el.style.color =
        h > 0.001 ? `rgb(${r0 + (r1 - r0) * h} ${g0 + (g1 - g0) * h} ${b0 + (b1 - b0) * h})` : '';
    });
  });

  // Raycast hover on the node bodies; desktop fine pointer only. The cursor
  // stays default: nodes are not links (spec §10).
  const setHovered = (id: NodeId | null) => {
    if (sceneState.hovered === id) return;
    sceneState.hovered = id;
    invalidate();
  };
  const hoverHandlers = interactive
    ? {
        onPointerMove: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) setHovered(NODES[e.instanceId].id);
        },
        onPointerOut: () => setHovered(null),
      }
    : {};

  return (
    <group ref={system} name="orbit-system">
      <group position-y={orbit.y} rotation-x={orbit.tilt}>
        <primitive object={orbitLine} />
        {[...arcs, ...paths].map((line) => (
          <primitive key={line.name} object={line} />
        ))}
      </group>

      <instancedMesh
        ref={bodies}
        args={[boxGeometry, undefined, NODES.length]}
        name="node-bodies"
        {...hoverHandlers}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.1} />
      </instancedMesh>
      {outlines.map((edge) => (
        <primitive key={edge.name} object={edge} />
      ))}
      <instancedMesh ref={dots} args={[undefined, undefined, NODES.length]} name="node-dots">
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>

      {PACKET_ANGLES.slice(0, packets.count).map((angle, i) => (
        <mesh
          key={angle}
          ref={(m) => {
            packetRefs.current[i] = m;
          }}
          name="packet"
          visible={false}
        >
          <sphereGeometry args={[packets.radius, 12, 12]} />
          <meshBasicMaterial color={COLORS.packet} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export default Orbit;
