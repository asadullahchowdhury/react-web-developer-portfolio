/**
 * Mutable state shared between the DOM layer and the R3F scene.
 * Written and read every frame without React re-renders (spec §13).
 */

import type { NodeId } from './config';

export const sceneState = {
  /** DOM label elements, positioned by the scene each rendered frame. */
  labels: {} as Partial<Record<NodeId, HTMLElement | null>>,
};
