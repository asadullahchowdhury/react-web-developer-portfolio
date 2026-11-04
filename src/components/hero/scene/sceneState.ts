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
};

// Dev-only handle for inspecting the scene from the browser console
if (import.meta.env.DEV) {
  (window as unknown as { __labState: typeof sceneState }).__labState = sceneState;
}
