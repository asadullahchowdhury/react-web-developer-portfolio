import { useCallback, useEffect, useState } from 'react';
import { supportsWebGL } from '../../lib/capabilities';
import type { SceneMode } from './useSceneMode';

/**
 * poster  — first paint; only the static poster is shown
 * loading — the 3D chunk is downloading / the canvas is starting
 * ready   — first frame drawn; canvas fades in over the poster
 * failed  — no WebGL, chunk error or context lost; poster stays for good
 */
export type CanvasState = 'poster' | 'loading' | 'ready' | 'failed';

export interface LabCanvasControl {
  state: CanvasState;
  mobile: boolean;
  reducedMotion: boolean;
  /**
   * Canvas spans the whole hero so the camera dolly can grow past the stage
   * box (desktop pin only). Otherwise the canvas stays inside the stage.
   */
  expanded: boolean;
  showCanvas: boolean;
  canvasVisible: boolean;
  fadeMs: number;
  onReady: () => void;
  onFailure: () => void;
}

/** Waits for the window load event, then for the browser to be idle. */
function afterLoadAndIdle(callback: () => void): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: number | undefined;

  const scheduleIdle = () => {
    if (cancelled) return;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => !cancelled && callback(), { timeout: 1500 });
    } else {
      // Safari has no requestIdleCallback; TS types it as always present.
      timeoutId = setTimeout(() => !cancelled && callback(), 200) as unknown as number;
    }
  };

  if (document.readyState === 'complete') scheduleIdle();
  else window.addEventListener('load', scheduleIdle, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', scheduleIdle);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}

/** Lazy 3D canvas lifecycle (spec §13): load after first paint, fall back to the poster. */
export function useLabCanvas(mode: SceneMode): LabCanvasControl {
  const [state, setState] = useState<CanvasState>('poster');

  useEffect(() => {
    if (!supportsWebGL()) {
      setState('failed');
      return;
    }
    return afterLoadAndIdle(() => setState('loading'));
  }, []);

  const onReady = useCallback(() => setState('ready'), []);
  const onFailure = useCallback(() => setState('failed'), []);

  return {
    state,
    mobile: mode.mobile,
    reducedMotion: mode.reducedMotion,
    // Same conditions as the hero pin (useHeroScroll): no dolly, no overflow
    expanded: !mode.mobile && !mode.reducedMotion,
    showCanvas: state === 'loading' || state === 'ready',
    canvasVisible: state === 'ready',
    fadeMs: mode.reducedMotion ? 200 : 300,
    onReady,
    onFailure,
  };
}
