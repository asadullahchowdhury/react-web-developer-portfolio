import { type RefObject, useEffect } from 'react';
import { prefersReducedMotion } from '../../lib/capabilities';
import { EASE_LAB, gsap } from '../../lib/motion';
import { loadScrollLibs, scrollToPosition, setPinActive } from '../../lib/scroll';

/** Scrub lag in seconds (spec §11.2). */
const SCRUB = 0.4;
/** Cards fade to this opacity as they slide out past the left column's edge. */
const BEHIND_OPACITY = 0.4;
/** Width of the soft edge where cards leave the track window (px). */
const EDGE = 64;

export interface WorkScrollRefs {
  section: RefObject<HTMLElement>;
  /** The visible window of the track (right column). */
  viewport: RefObject<HTMLElement>;
  track: RefObject<HTMLElement>;
  fill: RefObject<HTMLElement>;
  /** "Scroll →" hint; fades out once the last card is current. */
  hint: RefObject<HTMLElement>;
  /** Void-coloured gradient over the track window's left edge. */
  edge: RefObject<HTMLElement>;
}

/**
 * Desktop Work journey (spec §11.2): pins `#projects` for (cards − 1) × 100vh
 * and maps vertical scroll to the track's translateX. The track window clips
 * at the left column's right edge, so cards never pass under the heading.
 * Drives the `NN` counter (the card with the most visible width in the
 * window), the progress fill, the "Scroll" hint and the fade of cards as they
 * leave through the left edge.
 * Focusing a card scrolls the page so the card is fully in view.
 *
 * `mode`:
 *  - 'pin'    desktop with motion
 *  - 'native' desktop with reduced motion or touch: the track scrolls natively
 *  - 'stack'  below 768 px: cards stack, nothing to drive
 */
export function useWorkScroll(
  refs: WorkScrollRefs,
  mode: 'pin' | 'native' | 'stack',
  /** Called with the 1-based current card whenever it changes. Must be stable. */
  onCurrent: (index: number) => void,
) {
  useEffect(() => {
    const section = refs.section.current;
    const viewport = refs.viewport.current;
    const track = refs.track.current;
    const fill = refs.fill.current;
    const hint = refs.hint.current;
    const edge = refs.edge.current;
    if (!section || !viewport || !track) return;

    // Below 768 px: cards scale in from 0.96 as they enter (POLISH P2-16)
    if (mode === 'stack') {
      if (prefersReducedMotion()) return;
      let cancelled = false;
      let revert = () => {};
      loadScrollLibs().then(() => {
        if (cancelled) return;
        const ctx = gsap.context(() => {
          track.querySelectorAll<HTMLElement>('[data-work-card]').forEach((card) => {
            gsap.from(card, {
              scale: 0.96,
              opacity: 0,
              duration: 0.6,
              ease: EASE_LAB,
              scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            });
          });
        }, track);
        revert = () => ctx.revert();
      });
      return () => {
        cancelled = true;
        revert();
      };
    }

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-work-card]'));
    let lastCurrent = 0;
    const total = cards.length;

    /** Counter, fill and fades for a given track offset (px, ≤ 0) and progress. */
    const paint = (offset: number, progress: number, fade: boolean) => {
      // Current card = the one with the largest visible width in the window
      const width = viewport.clientWidth;
      let current = 1;
      let best = -1;
      cards.forEach((card, i) => {
        const left = card.offsetLeft + offset;
        const right = left + card.offsetWidth;
        const visible = Math.min(right, width) - Math.max(left, 0);
        if (visible > best + 1) {
          best = visible;
          current = i + 1;
        }
        if (fade) {
          // Full opacity until the card reaches the edge, 40% once half of it is gone
          const t = Math.min(Math.max(1 + left / (card.offsetWidth / 2), 0), 1);
          card.style.opacity = String(BEHIND_OPACITY + (1 - BEHIND_OPACITY) * t);
        }
      });
      if (current !== lastCurrent) {
        lastCurrent = current;
        onCurrent(current);
      }
      if (fill) fill.style.transform = `scaleX(${progress})`;
      if (hint) hint.style.opacity = current === total ? '0' : '';
      if (edge) edge.style.opacity = String(Math.min(Math.max(-offset / EDGE, 0), 1));
    };

    // Reduced motion / touch: native horizontal scroll, no pin
    if (mode === 'native') {
      const onScroll = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        paint(-viewport.scrollLeft, max > 0 ? viewport.scrollLeft / max : 0, false);
      };
      onScroll();
      viewport.addEventListener('scroll', onScroll, { passive: true });
      return () => viewport.removeEventListener('scroll', onScroll);
    }

    let cancelled = false;
    let teardown = () => {};

    loadScrollLibs().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      const ctx = gsap.context(() => {
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(1, total - 1) * window.innerHeight}`,
            pin: true,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            onToggle: (self) => setPinActive('work', self.isActive),
          },
          onUpdate: () => {
            const x = Number(gsap.getProperty(track, 'x')) || 0;
            const d = distance();
            paint(x, d > 0 ? -x / d : 0, true);
          },
        });
        paint(0, 0, true);

        // Keyboard: focusing a card brings it fully into view
        const onFocusIn = (e: FocusEvent) => {
          const card = (e.target as Element).closest<HTMLElement>('[data-work-card]');
          const st = tween.scrollTrigger;
          if (!card || !st) return;
          const x = Number(gsap.getProperty(track, 'x')) || 0;
          const left = card.offsetLeft + x;
          const right = left + card.offsetWidth;
          if (left >= 0 && right <= viewport.clientWidth) return;
          const d = distance();
          const targetX = Math.min(card.offsetLeft, d);
          const progress = d > 0 ? targetX / d : 0;
          scrollToPosition(st.start + progress * (st.end - st.start));
        };
        track.addEventListener('focusin', onFocusIn);
        return () => track.removeEventListener('focusin', onFocusIn);
      }, section);

      teardown = () => {
        ctx.revert();
        setPinActive('work', false);
        cards.forEach((c) => (c.style.opacity = ''));
        if (hint) hint.style.opacity = '';
        if (edge) edge.style.opacity = '';
      };
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [refs.section, refs.viewport, refs.track, refs.fill, refs.hint, refs.edge, mode, onCurrent]);
}
