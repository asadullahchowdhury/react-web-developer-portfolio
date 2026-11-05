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

const INTERACTION_EVENTS = ['pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;

/**
 * Waits for the user's first touch, scroll, wheel or key press, then for load
 * and idle. Used on mobile so the scene's startup work (about 1 s of
 * main-thread time on mid-range phones) never competes with the first load;
 * the poster is shown until then.
 */
function afterFirstInteraction(callback: () => void): () => void {
  let cancelIdle: (() => void) | undefined;
  const opts = { passive: true, capture: true } as const;

  const remove = () => INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, start, opts));
  function start() {
    remove();
    cancelIdle = afterLoadAndIdle(callback);
  }
  INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, start, opts));

  return () => {
    remove();
    cancelIdle?.();
  };
}

/**
 * Lazy 3D canvas lifecycle (spec §13): load after first paint, fall back to
 * the poster. On mobile the scene waits for the first interaction.
 */
export function useLabCanvas(mode: SceneMode): LabCanvasControl {
  const [state, setState] = useState<CanvasState>('poster');
  const { mobile } = mode;

  useEffect(() => {
    if (!supportsWebGL()) {
      setState('failed');
      return;
    }
    const begin = () => setState((s) => (s === 'poster' ? 'loading' : s));
    return mobile ? afterFirstInteraction(begin) : afterLoadAndIdle(begin);
  }, [mobile]);

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
