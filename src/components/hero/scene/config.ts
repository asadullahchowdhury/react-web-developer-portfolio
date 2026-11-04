/**
 * Scene constants from hero-redesign-spec §6–8. World units, Y-up.
 *
 * Camera, hologram height and all colours/opacities are spec values.
 * Horizontal sizes (rings, pad, cone, orbit) are tuned so the rest framing
 * matches artboard 01, which §7.2 makes the priority: with the spec camera
 * (FOV 35°, z 7.5) the spec radii (orbit 3.2, outer ring 3.1) would place
 * INTERFACE / SERVICES outside the stage. Spec values are kept alongside.
 */

export const COLORS = {
  void: '#07090D',
  graphite: '#11161F',
  signal: '#9CC9FF',
  signalSoft: '#CFE4FF',
  packet: '#EDF4FF',
  dust: '#C9D8EE',
} as const;

export const CAMERA = {
  rest: { fov: 35, position: [0, 1.4, 7.5], lookAt: [0, 1.1, 0] },
  dollyEnd: { fov: 28, position: [0, 1.3, 4.2], lookAt: [0, 1.2, 0] },
  near: 0.1,
  far: 40,
} as const;

export const FOG = { color: COLORS.void, near: 6, far: 16 } as const;

export const LIGHTS = {
  ambient: { sky: '#AFC4E0', ground: COLORS.void, intensity: 0.25 },
  key: { position: [4, 6, 3], color: '#DCEBFF', intensity: 0.8 },
  rim: { position: [-3, 2, -4], color: COLORS.signal, intensity: 0.4 },
} as const;

/** Device-pixel-ratio clamps (spec §13). */
export const DPR = {
  desktop: [1, 1.75] as [number, number],
  mobile: [1, 1.5] as [number, number],
};

/** Selective bloom (spec §6): threshold ≈ 0.8, intensity ≈ 0.6, radius ≈ 0.4. Desktop only. */
export const BLOOM = {
  threshold: 0.8,
  smoothing: 0.3,
  intensity: 0.6,
  radius: 0.4,
  iterations: 2,
};

/** Render layer used to pick bloom objects, and the objects that join it. */
export const BLOOM_LAYER = 1;
export const BLOOM_TARGETS = ['hologram', 'packet', 'node-dots', 'pad-glow'] as const;

/** Low-end detection (spec §13): below 40 fps for 2 s → drop bloom, halve dust, DPR 1. */
export const PERF = {
  minFps: 40,
  sustainSeconds: 2,
  warmupSeconds: 1.5,
};

export const WORLD = {
  /** spec: outer r 3.1 (white 7%), inner r 1.5 (signal 35%) */
  rings: { outerRadius: 2.03, outerOpacity: 0.07, innerRadius: 0.98, innerOpacity: 0.35, segments: 160 },
  /** spec: r 1.2, signal 35% → 0 */
  pad: { radius: 0.78, opacity: 0.35 },
  /** spec: bottom r ~0.9, top r ~1.5, height ~3.2, alpha 0.14 → 0 */
  cone: { bottomRadius: 0.7, topRadius: 1.08, height: 3.2, opacity: 0.14 },
  /** spec: ~2.2 tall, head top ≈ y 2.2, base opacity 0.6. Base raised to 0.3 so the
   *  shoulders float above the pad as in artboard 01 (head top ≈ 2.5). */
  hologram: {
    height: 2.2,
    baseY: 0.3,
    opacity: 0.6,
    /** CSS px between scanlines (artboard 01: ~4px) */
    linePitch: 4,
    maskUrl: '/assets/lab/hologram-mask.svg',
  },
  /** spec: rx 3.2, rz 1.6, y 0.9, signal 22%; tilted so the front sits lower */
  orbit: { rx: 2.17, rz: 1.25, y: 0.55, tilt: 0.92, opacity: 0.22, segments: 192 },
  /** spec: rounded box 0.24³, radius 0.05; edges signal 60% */
  node: { size: 0.24, radius: 0.05, edgeOpacity: 0.6 },
  /** spec: 2–3 spheres r 0.025, #EDF4FF */
  packets: { count: 3, radius: 0.025 },
  /** spec: 300–600 desktop / 120 mobile, size 1–1.5px, opacity 0.3–0.5 */
  dust: {
    desktop: 480,
    mobile: 120,
    bounds: { x: [-4.5, 4.5], y: [-0.2, 4.6], z: [-4, 2.5] } as const,
  },
} as const;

export type NodeId = 'interface' | 'api' | 'services' | 'database';

/**
 * Nodes on the orbit (spec §7.3). Angle: 0° = screen right, counter-clockwise
 * seen from above. Data flows interface → api → services → database.
 * `labelSide` follows artboard 01 (API label above its node, others below).
 */
export const NODES: readonly { id: NodeId; label: string; angle: number; labelSide: 'above' | 'below' }[] = [
  { id: 'interface', label: 'Interface', angle: 180, labelSide: 'below' },
  { id: 'api', label: 'API', angle: 122, labelSide: 'above' },
  { id: 'services', label: 'Services', angle: 0, labelSide: 'below' },
  { id: 'database', label: 'Database', angle: 300, labelSide: 'below' },
];
