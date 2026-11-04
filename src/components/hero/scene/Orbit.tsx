import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  Float32BufferAttribute,
  type InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Vector3,
} from 'three';
import { COLORS, NODES, WORLD } from './config';
import { ellipsePoints, orbitPoint, roundedBoxGeometry, roundedSquareOutline } from './geometry';
import { sceneState } from './sceneState';

const PACKET_ANGLES = [20, 140, 260] as const;

/** Label offset from the projected node centre, in CSS px (artboard 01). */
const LABEL_GAP = { above: 18, below: 24 } as const;

/**
 * Orbit ellipse, the four system nodes, data packets, and the DOM labels'
 * screen positions (spec §7.1, §7.3, §8 #6–9).
 */
const Orbit = () => {
  const { orbit, node, packets } = WORLD;
  const bodies = useRef<InstancedMesh>(null);
  const dots = useRef<InstancedMesh>(null);

  const nodePositions = useMemo(() => NODES.map((n) => orbitPoint(n.angle)), []);

  const { orbitLine, outlines, boxGeometry } = useMemo(() => {
    const line = new Line(
      ellipsePoints(orbit.rx, orbit.rz, orbit.segments),
      new LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: orbit.opacity, depthWrite: false }),
    );
    line.name = 'orbit-line';

    // One geometry holding the front-face outline of every node
    const outline = roundedSquareOutline(node.size, node.radius);
    const merged: number[] = [];
    for (const p of nodePositions) {
      for (let i = 0; i < outline.length; i += 3) {
        merged.push(outline[i] + p.x, outline[i + 1] + p.y, outline[i + 2] + p.z + node.size / 2 + 0.002);
      }
    }
    const outlineGeometry = new BufferGeometry();
    outlineGeometry.setAttribute('position', new Float32BufferAttribute(merged, 3));
    const edges = new LineSegments(
      outlineGeometry,
      new LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: node.edgeOpacity, depthWrite: false }),
    );
    edges.name = 'node-edges';

    return { orbitLine: line, outlines: edges, boxGeometry: roundedBoxGeometry(node.size, node.radius) };
  }, [orbit, node, nodePositions]);

  useLayoutEffect(() => {
    const m = new Matrix4();
    nodePositions.forEach((p, i) => {
      bodies.current?.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z));
      dots.current?.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z + node.size / 2 + 0.006));
    });
    if (bodies.current) bodies.current.instanceMatrix.needsUpdate = true;
    if (dots.current) dots.current.instanceMatrix.needsUpdate = true;
  }, [nodePositions, node.size]);

  const packetPositions = useMemo(() => PACKET_ANGLES.slice(0, packets.count).map((a) => orbitPoint(a)), [packets.count]);

  // Project node centres to the canvas and move the DOM labels there
  const projected = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    // useFrame runs before the renderer refreshes the camera matrices
    camera.updateMatrixWorld();
    NODES.forEach((n, i) => {
      const el = sceneState.labels[n.id];
      if (!el) return;
      projected.copy(nodePositions[i]).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
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
        <meshStandardMaterial color={COLORS.graphite} roughness={0.7} metalness={0.1} />
      </instancedMesh>
      <primitive object={outlines} />
      <instancedMesh ref={dots} args={[undefined, undefined, NODES.length]} name="node-dots">
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshBasicMaterial color={COLORS.signalSoft} toneMapped={false} />
      </instancedMesh>

      {packetPositions.map((p, i) => (
        <mesh key={i} name="packet" position={p}>
          <sphereGeometry args={[packets.radius, 12, 12]} />
          <meshBasicMaterial color={COLORS.packet} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export default Orbit;
