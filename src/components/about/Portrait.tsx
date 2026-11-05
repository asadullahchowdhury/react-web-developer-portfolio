import { useEffect, useRef } from 'react';
import { ABOUT } from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_LAB, gsap } from '../../lib/motion';
import { loadScrollLibs } from '../../lib/scroll';

/** Real portrait (spec §14), 4:5, re-encoded from docs/source-assets/. */
const PORTRAIT = { src: '/assets/images/portrait-about.webp', width: 960, height: 1200 };

/**
 * About portrait (spec §17): 4:5 figure, radius 18, graphite fill, 1 px
 * border in the hologram's signal blue, mono caption row.
 *
 * Entrance (once, at 20% into view): a bright scanline sweeps top → bottom
 * while the photo is revealed behind it — the hologram "becomes" the person.
 * None of this with reduced motion.
 */
const Portrait = () => {
  const figure = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = figure.current;
    if (!root || reduced) return;
    let cancelled = false;
    let teardown = () => {};

    loadScrollLibs().then(() => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const media = root.querySelector('[data-portrait-media]');
        const sweep = root.querySelector('[data-portrait-sweep]');
        // Hidden start state, applied up front (a scroll-triggered timeline
        // doesn't render its fromTo starting values until it plays)
        gsap.set(root, { opacity: 0 });
        gsap.set(media, { clipPath: 'inset(0 0 100% 0)' });
        gsap.set(sweep, { top: '0%', opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: EASE_LAB },
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        });
        tl.to(root, { opacity: 1, duration: 0.5 }, 0)
          .set(sweep, { opacity: 1 }, 0.1)
          .to(media, { clipPath: 'inset(0 0 0% 0)', duration: 1.1 }, 0.1)
          .to(sweep, { top: '100%', duration: 1.1 }, 0.1)
          .to(sweep, { opacity: 0, duration: 0.3 }, 1.1);
      }, root);
      teardown = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [reduced]);

  return (
    <figure ref={figure} className="flex w-full flex-col gap-3">
      <div className="relative h-[400px] overflow-hidden rounded-[18px] border border-[rgb(156_201_255/0.22)] bg-graphite md:aspect-[4/5] md:h-auto">
        <div data-portrait-media className="absolute inset-0">
          <img
            src={PORTRAIT.src}
            alt="Rahat Chowdhury"
            width={PORTRAIT.width}
            height={PORTRAIT.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <span
          data-portrait-sweep
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-full h-px bg-signal-soft opacity-0 shadow-[0_0_14px_rgb(var(--signal-rgb)/0.9)]"
        />
      </div>
      <figcaption className="flex justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">
        <span>{ABOUT.portraitCaption.left}</span>
        <span>{ABOUT.portraitCaption.right}</span>
      </figcaption>
    </figure>
  );
};

export default Portrait;
