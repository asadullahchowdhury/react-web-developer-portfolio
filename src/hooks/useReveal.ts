import { type RefObject, useEffect } from 'react';
import { EASE_LAB, gsap, SplitText } from '../lib/motion';
import { loadScrollLibs } from '../lib/scroll';
import { useReducedMotion } from './useReducedMotion';

/** Entrances start once the element is 20% into the viewport (spec §18). */
const START = 'top 80%';

/**
 * Section entrances (spec §18), triggered once:
 *  - `[data-reveal="lines"]`: each rendered line rises inside a mask, 80 ms stagger
 *    (same as the hero H1);
 *  - `[data-reveal="fade"]`: fades up 12 px, 60 ms stagger between elements
 *    that enter together.
 * With reduced motion nothing is hidden or animated.
 */
export function useReveal(scope: RefObject<HTMLElement>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!root || reduced) return;

    let cancelled = false;
    let teardown = () => {};

    // Set up only when the section is within half a viewport of the screen,
    // so line-splitting and triggers for the whole page don't all run on load
    const setup = () => loadScrollLibs().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 100,
                duration: 0.8,
                stagger: 0.08,
                ease: EASE_LAB,
                scrollTrigger: { trigger: el, start: START, once: true },
              }),
          });
        });

        const fades = gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]', root);
        if (fades.length) {
          gsap.set(fades, { opacity: 0, y: 12 });
          ScrollTrigger.batch(fades, {
            start: START,
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: EASE_LAB }),
          });
        }
      }, root);
      teardown = () => ctx.revert();
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setup();
      },
      { rootMargin: '50% 0px 50% 0px' },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      teardown();
    };
  }, [scope, reduced]);
}
