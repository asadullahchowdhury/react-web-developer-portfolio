/** Stack diagram geometry (spec §19), shared by the diagram and the scroll hook. */

export interface DiagramGeometry {
  width: number;
  height: number;
  /** Rhombus width / height and slab thickness. */
  w: number;
  h: number;
  t: number;
  cx: number;
  /** Centre y of each slab when spread. */
  spread: number[];
  /** Centre y of each slab when compressed. */
  compressed: number[];
  labels: boolean;
  /** Label anchor x and text x (full variant). */
  leaderX?: number;
  labelX?: number;
}

const spreadFrom = (first: number, gap: number) => [0, 1, 2, 3].map((i) => first + i * gap);
const compressAround = (centre: number, gap: number) => [0, 1, 2, 3].map((i) => centre + (i - 1.5) * gap);

/** Desktop: viewBox 820 × 720, slabs ~420 × 160, 16 thick, 150 apart → 24 apart. */
export const FULL_GEOMETRY: DiagramGeometry = {
  width: 820,
  height: 720,
  w: 420,
  h: 160,
  t: 16,
  cx: 255,
  spread: spreadFrom(118, 150),
  compressed: compressAround(343, 24),
  labels: true,
  leaderX: 560,
  labelX: 574,
};

/** Mobile: static 350 × 220 mini diagram. */
export const MINI_GEOMETRY: DiagramGeometry = {
  width: 350,
  height: 220,
  w: 300,
  h: 114,
  t: 12,
  cx: 175,
  spread: spreadFrom(60, 30),
  compressed: spreadFrom(60, 30),
  labels: false,
};

/** Labels of layers that aren't active during the scroll sequence (POLISH P1-9). */
export const INACTIVE_LABEL_OPACITY = 0.55;
