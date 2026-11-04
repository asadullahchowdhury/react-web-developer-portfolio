/**
 * Mutable state shared between the DOM layer and the R3F scene.
 * Written and read every frame without React re-renders (spec §13).
 */

import type { NodeId } from './config';

export const sceneState = {
  /** DOM label elements, positioned by the scene each rendered frame. */
  labels: {} as Partial<Record<NodeId, HTMLElement | null>>,
  /** True while the canvas is on-screen and the tab is visible. */
  rendering: false,
  /** Last measured frame rate (diagnostics). */
  fps: 0,
  /** 'high' until low-end detection degrades the scene. */
  quality: 'high' as 'high' | 'low',
  /** True while the bloom pass owns rendering. */
  bloom: false,
  /** Idle loops run only when true (false with reduced motion). */
  motion: false,
  /** 3D intro progress, each 0 → 1 (spec §9.1). Tweened by SceneIntro. */
  intro: {
    rings: 0,
    pad: 0,
    cone: 0,
    reveal: 0,
    orbit: 0,
    packets: 0,
    dust: 0,
    nodes: { interface: 0, api: 0, services: 0, database: 0 } as Record<NodeId, number>,
  },
  /**
   * Smoothed pointer, −1…1 across the viewport (y down), already scaled by
   * the scroll fade-out. Written by useHeroParallax (spec §10).
   */
  pointer: { x: 0, y: 0 },
  /** Hero pin progress 0 → 1 (spec §11). Written by the scroll step. */
  scrollProgress: 0,
  /** Node under the pointer (spec §10 node hover). */
  hovered: null as NodeId | null,
};

// Dev-only handle for inspecting the scene from the browser console
if (import.meta.env.DEV) {
  (window as unknown as { __labState: typeof sceneState }).__labState = sceneState;
}
