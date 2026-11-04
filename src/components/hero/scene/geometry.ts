import { BufferGeometry, ExtrudeGeometry, Float32BufferAttribute, Shape, Vector3 } from 'three';
import { WORLD } from './config';

/** Closed ellipse in the XZ plane as a line strip (first point repeated for draw-on). */
export function ellipsePoints(rx: number, rz: number, segments: number, y = 0): BufferGeometry {
  const positions: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(a) * rx, y, -Math.sin(a) * rz);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
}

/**
 * World position of a point on the tilted orbit.
 * Angle in degrees: 0° = +X (screen right), counter-clockwise seen from above
 * (90° = away from the camera). The tilt raises the back and lowers the front.
 */
export function orbitPoint(angleDeg: number, target = new Vector3()): Vector3 {
  const { rx, rz, y, tilt } = WORLD.orbit;
  const a = (angleDeg * Math.PI) / 180;
  const lx = Math.cos(a) * rx;
  const lz = -Math.sin(a) * rz;
  // Rotate the orbit plane about X by `tilt`
  return target.set(lx, y - lz * Math.sin(tilt), lz * Math.cos(tilt));
}

/** Rounded box, centred at the origin (same construction as drei's RoundedBox). */
export function roundedBoxGeometry(size: number, radius: number, smoothness = 3): ExtrudeGeometry {
  const eps = 0.00001;
  const r = radius - eps;
  const shape = new Shape();
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, size - r * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(size - r * 2, size - r * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(size - r * 2, eps, eps, 0, -Math.PI / 2, true);
  const geometry = new ExtrudeGeometry(shape, {
    depth: size - radius * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: r,
    bevelThickness: radius,
    curveSegments: smoothness,
  });
  geometry.center();
  return geometry;
}

/** Outline of a rounded square in the XY plane, as line-segment pairs. */
export function roundedSquareOutline(size: number, radius: number, cornerSegments = 6): number[] {
  const h = size / 2;
  const pts: [number, number][] = [];
  const corners: [number, number, number][] = [
    [h - radius, h - radius, 0],
    [-h + radius, h - radius, Math.PI / 2],
    [-h + radius, -h + radius, Math.PI],
    [h - radius, -h + radius, (Math.PI * 3) / 2],
  ];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= cornerSegments; i++) {
      const a = start + (i / cornerSegments) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius]);
    }
  }
  const segments: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    segments.push(x1, y1, 0, x2, y2, 0);
  }
  return segments;
}

/** Small deterministic PRNG so the dust field is identical on every load. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
