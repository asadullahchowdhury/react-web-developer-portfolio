/** Scene constants from hero-redesign-spec §6–7. World units, Y-up. */

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
