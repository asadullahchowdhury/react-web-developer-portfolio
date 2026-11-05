import { useEffect, useState } from 'react';
import { isNavigating, isPinActive } from '../../lib/scroll';

/** Desktop state 2 (floating glass bar) starts after this much scroll. */
export const COMPACT_AFTER = 80;
/** Ignore direction changes smaller than this, so the bar doesn't jitter. */
const DIRECTION_THRESHOLD = 6;

export interface HeaderScrollState {
  /** Past COMPACT_AFTER — desktop shows the floating bar. */
  compact: boolean;
  /** Scrolling down — the bar slides away (never during the hero pin). */
  hidden: boolean;
}

/**
 * Header scroll behaviour: compact after 80 px; hide on scroll down, show on
 * scroll up; never hidden near the top, during any pinned section, during a
 * navigation scroll, or while `locked` (e.g. the mobile menu is open).
 */
export function useHeaderScroll(locked: boolean): HeaderScrollState {
  const [state, setState] = useState<HeaderScrollState>({ compact: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      setState((prev) => {
        const compact = y > COMPACT_AFTER;
        let hidden = prev.hidden;
        if (locked || !compact || isPinActive() || isNavigating()) hidden = false;
        else if (delta > DIRECTION_THRESHOLD) hidden = true;
        else if (delta < -DIRECTION_THRESHOLD) hidden = false;
        return prev.compact === compact && prev.hidden === hidden ? prev : { compact, hidden };
      });
      if (Math.abs(delta) > DIRECTION_THRESHOLD) lastY = y;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
    };
  }, [locked]);

  return state;
}
