import { type RefObject, useEffect } from 'react';
import { gsap } from '../../lib/motion';
import { loadScrollLibs, scrollToPosition, setPinActive } from '../../lib/scroll';

/** Scrub lag in seconds (spec §11.2). */
const SCRUB = 0.4;
/** Cards fade to this opacity once they have slid behind the left column. */
const BEHIND_OPACITY = 0.4;

export interface WorkScrollRefs {
  section: RefObject<HTMLElement>;
  /** The visible window of the track (right column). */
  viewport: RefObject<HTMLElement>;
  track: RefObject<HTMLElement>;
  counter: RefObject<HTMLElement>;
  fill: RefObject<HTMLElement>;
}

/**
 * Desktop Work journey (spec §11.2): pins `#projects` for (cards − 1) × 100vh
 * and maps vertical scroll to the track's translateX. Drives the `NN` counter
 * (a card becomes current when its centre passes the left third), the
 * progress fill and the fade of cards passing behind the left column.
 * Focusing a card scrolls the page so the card is fully in view.
 *
 * `mode`:
 *  - 'pin'    desktop with motion
 *  - 'native' desktop with reduced motion or touch: the track scrolls natively
 *  - 'stack'  below 768 px: cards stack, nothing to drive
 */
export function useWorkScroll(refs: WorkScrollRefs, mode: 'pin' | 'native' | 'stack') {
  useEffect(() => {
    const section = refs.section.current;
    const viewport = refs.viewport.current;
    const track = refs.track.current;
    const counter = refs.counter.current;
    const fill = refs.fill.current;
    if (!section || !viewport || !track || mode === 'stack') return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-work-card]'));
    const total = cards.length;

    /** Counter, fill and fades for a given track offset (px, ≤ 0) and progress. */
    const paint = (offset: number, progress: number, fade: boolean) => {
      // A card becomes current when its centre passes this line: the track's
      // left third at the start (spec §11.2), sliding to the right edge by the
      // end, because the last card never reaches the left third.
      const width = viewport.clientWidth;
      const line = width / 3 + progress * (width - width / 3);
      let current = 1;
      cards.forEach((card, i) => {
        const left = card.offsetLeft + offset;
        if (i > 0 && left + card.offsetWidth / 2 <= line) current = i + 1;
        if (fade) {
          const right = left + card.offsetWidth;
          const t = Math.min(Math.max(right / card.offsetWidth, 0), 1);
          card.style.opacity = String(BEHIND_OPACITY + (1 - BEHIND_OPACITY) * t);
        }
      });
      if (counter) counter.textContent = String(current).padStart(2, '0');
      if (fill) fill.style.transform = `scaleX(${progress})`;
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
      };
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [refs.section, refs.viewport, refs.track, refs.counter, refs.fill, mode]);
}
