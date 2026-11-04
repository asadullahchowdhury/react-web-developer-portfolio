import { type RefObject, useLayoutEffect } from 'react';
import { prefersReducedMotion } from '../../lib/capabilities';
import { EASE_LAB, gsap, introDurationScale, SplitText } from '../../lib/motion';

/**
 * DOM intro (spec §9.1) and glass-panel idle float (§9.2).
 *
 * Runs in a layout effect so starting states are applied before the first
 * paint (no flash). Elements stay clickable while hidden: only opacity and
 * transforms animate. With reduced motion nothing is hidden or animated.
 *
 * t (s) | element   | animation
 * 0.20  | header    | opacity, 0.4
 * 0.60  | label     | opacity, y 8 → 0, 0.5
 * 0.80  | H1 lines  | masked rise 100% → 0, stagger 0.08, 0.7
 * 1.25  | lead      | opacity, y 12 → 0, 0.6
 * 1.40  | CTAs      | opacity, y 12 → 0, stagger 0.06, 0.5
 * 1.55  | proof     | opacity, 0.5
 * 1.70  | panels    | opacity, y 12 → 0, stagger 0.12, 0.6
 * 1.90  | HUD       | opacity, 0.5
 */
export function useHeroIntro(scope: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    const d = introDurationScale();
    const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T & Element>(sel));
    const header = document.querySelector('header');
    const headline = root.querySelector<HTMLElement>('[data-intro="headline"]');

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE_LAB } });

      if (header) tl.fromTo(header, { opacity: 0 }, { opacity: 1, duration: 0.4 * d }, 0.2);
      tl.from(q('[data-intro="label"]'), { opacity: 0, y: 8, duration: 0.5 * d }, 0.6)
        .from(q('[data-intro="lead"]'), { opacity: 0, y: 12, duration: 0.6 * d }, 1.25)
        .from(q('[data-intro="cta"]'), { opacity: 0, y: 12, duration: 0.5 * d, stagger: 0.06 }, 1.4)
        .from(q('[data-intro="proof"]'), { opacity: 0, duration: 0.5 * d }, 1.55)
        .from(q('[data-intro="panel"]'), { opacity: 0, y: 12, duration: 0.6 * d, stagger: 0.12 }, 1.7)
        .from(q('[data-intro="hud"]'), { opacity: 0, duration: 0.5 * d }, 1.9);

      // H1: each rendered line rises inside its own mask. autoSplit re-splits
      // after font load / resize and carries the animation's progress over.
      if (headline) {
        split = SplitText.create(headline, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.7 * d,
              stagger: 0.08,
              ease: EASE_LAB,
              delay: 0.8,
            }),
        });
      }

      // Idle float: ±4px, 7 s and 9 s periods, out of phase (spec §9.2)
      q('[data-panel-float]').forEach((el, i) => {
        const period = i === 0 ? 7 : 9;
        gsap
          .fromTo(el, { y: -4 }, { y: 4, duration: period / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
          .progress(i === 0 ? 0 : 0.5);
      });
    }, root);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [scope]);
}
