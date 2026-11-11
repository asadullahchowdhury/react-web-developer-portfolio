import { type CSSProperties, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/motion';
import { loadScrollLibs } from '../../lib/scroll';

/** Owner's brush signature (480 × 260 WebP, from public/assets/brand/). Used as a mask. */
const SIGNATURE = '/assets/brand/rahat-signature.webp';

const mask: CSSProperties = {
  WebkitMaskImage: `url(${SIGNATURE})`,
  maskImage: `url(${SIGNATURE})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'left center',
  maskPosition: 'left center',
};

/**
 * Hand-signed sign-off under the About statement. The signature's shape masks
 * a soft white → signal-blue gradient (the hologram palette), tilted slightly.
 *
 * Entrance (as it is reached scrolling down): the signature "writes" itself
 * left to right while a small glowing pen tip rides the edge, 1.4 s. It
 * replays only after it has left the screen below and is reached again.
 * Reduced motion: shown at once. Decorative (the name is already in the
 * text), so it is aria-hidden.
 */
const Signature = ({ className = '' }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    let cancelled = false;
    let teardown = () => {};

    loadScrollLibs().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const ink = el.querySelector('[data-signature-ink]');
        const tip = el.querySelector('[data-signature-tip]');
        gsap.set(ink, { clipPath: 'inset(-10% 100% -10% 0)' });
        gsap.set(tip, { left: '0%', opacity: 0 });
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: 'power1.inOut' } })
          .set(tip, { opacity: 1 }, 0.15)
          .to(ink, { clipPath: 'inset(-10% 0% -10% 0)', duration: 1.4 }, 0.15)
          .to(tip, { left: '100%', duration: 1.4 }, 0.15)
          .to(tip, { opacity: 0, duration: 0.35, ease: 'power1.out' }, 1.45);

        // Writes whenever it is reached scrolling down. Scrolling back up past
        // it never replays; once it has dropped fully below the screen it
        // quietly resets, so the next pass down signs again.
        ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => tl.restart() });
        ScrollTrigger.create({ trigger: el, start: 'top bottom', onLeaveBack: () => tl.pause(0) });
      }, el);
      teardown = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [reduced]);

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none relative select-none ${className}`}>
      <div className="relative aspect-[480/260] w-full -rotate-[4deg]">
        <span
          data-signature-ink
          className="absolute inset-0 bg-[linear-gradient(100deg,#EDEFF3_0%,#CFE4FF_50%,#9CC9FF_100%)] [filter:drop-shadow(0_0_14px_rgb(156_201_255/0.25))]"
          style={mask}
        />
        {/* Pen tip: rides the writing edge, then fades */}
        <span
          data-signature-tip
          className="absolute top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(237_244_255/0.55),rgb(156_201_255/0.18)_45%,transparent)] opacity-0"
        />
      </div>
    </div>
  );
};

export default Signature;
