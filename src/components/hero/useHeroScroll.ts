import { type RefObject, useEffect } from 'react';
import { isMobileLike, prefersReducedMotion } from '../../lib/capabilities';
import { gsap } from '../../lib/motion';
import { registerScrollTarget, ScrollTrigger } from '../../lib/scroll';
import { sceneState } from './scene/sceneState';

/** Hero pin length as a multiple of the viewport height (spec §11.1). */
const PIN_VH = 2.2;
/** Scrub lag in seconds (spec §11.1). */
const SCRUB = 0.6;

/**
 * Hero scroll journey (spec §11.1, v1 crossfade).
 *
 * Desktop: `#hero` pins for 220vh and a scrubbed timeline maps progress p:
 *   0.00 → 0.35  copy fades and lifts, HUD fades (camera dolly + node
 *                light-ups run in the scene from sceneState.scrollProgress)
 *   0.35 → 0.80  glass panels scale to 1.15, drift toward the centre and fade;
 *                hologram dims (in the scene)
 *   0.80 → 1.00  scene layer fades to 15%; HUD counter becomes 02 / 04
 *
 * Hand-off: the pin uses no spacing; a measured runway after the hero makes
 * the Work section (#projects, positioned above the hero) slide over the
 * pinned hero and reach the top exactly at p = 1. So "end of the pin" and
 * "start of Work" are the same scroll position, and nav targets it via
 * registerScrollTarget (§11.3).
 *
 * Mobile / coarse pointer: no pin; the scene fades as the hero leaves (§12).
 * Reduced motion: no pin and no scroll animation (§13).
 */
export function useHeroScroll(scope: RefObject<HTMLElement>, runwayRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = scope.current;
    const runway = runwayRef.current;
    if (!root || !runway || prefersReducedMotion()) return;

    const sceneLayer = root.querySelector<HTMLElement>('[data-scene-layer]');

    // Mobile: no pin. Fade the scene as the hero scrolls away.
    if (isMobileLike()) {
      const ctx = gsap.context(() => {
        if (!sceneLayer) return;
        gsap.to(sceneLayer, {
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      }, root);
      return () => ctx.revert();
    }

    const pinLength = () => window.innerHeight * PIN_VH;
    // A hero taller than the viewport (short laptop screens; the desktop
    // hero is at least 760px) pins once its bottom reaches the viewport
    // bottom, so the whole hero is seen before the pin holds it.
    const tallHero = () => root.offsetHeight > window.innerHeight;
    const pinStartOffset = () => Math.max(0, root.offsetHeight - window.innerHeight);
    // Runway so that #projects reaches the top exactly at the end of the pin:
    // projectsTop = heroHeight + runway = pinStart + pinLength
    const setRunway = () => {
      runway.style.height = `${Math.max(0, pinStartOffset() + pinLength() - root.offsetHeight)}px`;
    };
    setRunway();
    ScrollTrigger.addEventListener('refreshInit', setRunway);

    let unregister = () => {};

    const ctx = gsap.context(() => {
      const q = (sel: string) => root.querySelectorAll<HTMLElement>(sel);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: () => (tallHero() ? 'bottom bottom' : 'top top'),
          end: () => `+=${pinLength()}`,
          pin: true,
          pinSpacing: false,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          sceneState.scrollProgress = tl.progress();
        },
      });

      tl.to(q('[data-hero-copy]'), { opacity: 0, y: -40, duration: 0.35 }, 0)
        .to(q('[data-hud-fade]'), { opacity: 0, duration: 0.35 }, 0)
        .to(q('[data-panel="deploy"]'), { scale: 1.15, xPercent: -60, yPercent: 40, opacity: 0, duration: 0.45 }, 0.35)
        .to(q('[data-panel="schema"]'), { scale: 1.15, xPercent: 60, yPercent: -40, opacity: 0, duration: 0.45 }, 0.35)
        .to(q('[data-hud-chapter="current"]'), { opacity: 0, duration: 0.04 }, 0.8)
        .to(q('[data-hud-chapter="next"]'), { opacity: 1, duration: 0.04 }, 0.8);
      if (sceneLayer) tl.to(sceneLayer, { opacity: 0.15, duration: 0.2 }, 0.8);
      tl.set({}, {}, 1); // timeline spans exactly p 0 → 1

      // "Enter the lab" and nav "Work" land at the end of the pin (§11.3)
      unregister = registerScrollTarget('projects', () => tl.scrollTrigger?.end ?? 0);
    }, root);

    return () => {
      unregister();
      ScrollTrigger.removeEventListener('refreshInit', setRunway);
      ctx.revert();
      runway.style.height = '0px';
      sceneState.scrollProgress = 0;
    };
  }, [scope, runwayRef]);
}
