import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  type Mesh,
  Quaternion,
  Vector3,
} from 'three';
import { COLORS, NODES, WORLD } from './config';
import { ellipsePoints, orbitPoint, roundedBoxGeometry, roundedSquareOutline } from './geometry';
import { sceneState } from './sceneState';

/** Packet start angles, evenly spaced (spec §9.2). */
const PACKET_ANGLES = [20, 140, 260] as const;
/** Packet speed in revolutions per second (spec §9.2). */
const PACKET_SPEED = 0.08;
/** Node dot pulse: 70–100% emissive, 3 s period, staggered (spec §9.2). */
const PULSE = { min: 0.7, period: 3 };

/** Label offset from the projected node centre, in CSS px (artboard 01). */
const LABEL_GAP = { above: 18, below: 24 } as const;

const IDENTITY = new Quaternion();

/**
 * Orbit ellipse, the four system nodes, data packets, and the DOM labels'
 * screen positions (spec §7.1, §7.3, §8 #6–9, §9).
 */
const Orbit = () => {
  const { orbit, node, packets } = WORLD;
  const bodies = useRef<InstancedMesh>(null);
  const dots = useRef<InstancedMesh>(null);
  const packetRefs = useRef<(Mesh | null)[]>([]);
  const travel = useRef(0);

  const nodePositions = useMemo(() => NODES.map((n) => orbitPoint(n.angle)), []);

  const { orbitLine, outlines, boxGeometry } = useMemo(() => {
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

    return { orbitLine: line, outlines: edges, boxGeometry: roundedBoxGeometry(node.size, node.radius) };
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

  useFrame(({ camera, size, clock }, delta) => {
    const { intro, motion } = sceneState;
    const t = clock.elapsedTime;

    // Orbit line draws on
    const points = Math.round(intro.orbit * orbit.segments) + 1;
    orbitLine.geometry.setDrawRange(0, intro.orbit > 0 ? points : 0);

    // Nodes: scale 0.6 → 1 and fade in; dots pulse once revealed
    NODES.forEach((n, i) => {
      const reveal = intro.nodes[n.id];
      const s = reveal > 0 ? 0.6 + 0.4 * reveal : 0;
      const p = nodePositions[i];

      tmp.scale.setScalar(s);
      bodies.current?.setMatrixAt(i, tmp.matrix.compose(p, IDENTITY, tmp.scale));
      bodies.current?.setColorAt(i, tmp.color.copy(tmp.voidColor).lerp(tmp.graphite, reveal));

      tmp.pos.set(p.x, p.y, p.z + (node.size / 2 + 0.006) * s);
      dots.current?.setMatrixAt(i, tmp.matrix.compose(tmp.pos, IDENTITY, tmp.scale));
      const pulse = motion
        ? PULSE.min + (1 - PULSE.min) * (0.5 + 0.5 * Math.sin((t / PULSE.period) * Math.PI * 2 - i * (Math.PI / 2)))
        : 1;
      dots.current?.setColorAt(i, tmp.color.copy(tmp.dotColor).multiplyScalar(pulse * reveal));

      const edge = outlines[i];
      edge.visible = reveal > 0;
      edge.scale.setScalar(Math.max(s, 0.0001));
      (edge.material as LineBasicMaterial).opacity = node.edgeOpacity * reveal;
    });
    for (const mesh of [bodies.current, dots.current]) {
      if (!mesh) continue;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // Packets appear, then travel along the orbit
    if (motion && intro.packets > 0) travel.current += Math.min(delta, 0.1) * PACKET_SPEED;
    packetRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      orbitPoint(PACKET_ANGLES[i] + travel.current * 360, mesh.position);
      mesh.visible = intro.packets > 0;
      mesh.scale.setScalar(Math.max(intro.packets, 0.0001));
    });

    // Labels: follow their nodes and fade in with them.
    // useFrame runs before the renderer refreshes the camera matrices.
    camera.updateMatrixWorld();
    NODES.forEach((n, i) => {
      const el = sceneState.labels[n.id];
      if (!el) return;
      tmp.projected.copy(nodePositions[i]).project(camera);
      const x = (tmp.projected.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.projected.y * 0.5 + 0.5) * size.height;
      el.style.opacity = String(intro.nodes[n.id]);
      el.style.transform =
        n.labelSide === 'above'
          ? `translate(${x}px, ${y - LABEL_GAP.above}px) translate(-50%, -100%)`
          : `translate(${x}px, ${y + LABEL_GAP.below}px) translate(-50%, 0)`;
    });
  });

  return (
    <group name="orbit-system">
      <group position-y={orbit.y} rotation-x={orbit.tilt}>
        <primitive object={orbitLine} />
      </group>

      <instancedMesh ref={bodies} args={[boxGeometry, undefined, NODES.length]} name="node-bodies">
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
