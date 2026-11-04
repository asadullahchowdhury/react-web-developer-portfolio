import { type RefObject, useEffect } from 'react';
import { gsap } from '../../lib/motion';
import { loadScrollLibs, registerScrollTarget, scrollToPosition, setHeroPinned } from '../../lib/scroll';
import { sceneState } from './scene/sceneState';
import type { SceneMode } from './useSceneMode';

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
 * Re-runs when the mode changes (window crosses 768px, motion setting).
 */
export function useHeroScroll(
  scope: RefObject<HTMLElement>,
  runwayRef: RefObject<HTMLElement>,
  mode: SceneMode,
) {
  const { mobile, reducedMotion } = mode;

  useEffect(() => {
    const root = scope.current;
    const runway = runwayRef.current;
    if (!root || !runway || reducedMotion) return;

    let cancelled = false;
    let teardown = () => {};

    loadScrollLibs().then(({ ScrollTrigger }) => {
      if (cancelled) return;

      // Poster layer in the stage, plus the hero-wide canvas layer on desktop
      const sceneLayers = Array.from(root.querySelectorAll<HTMLElement>('[data-scene-layer]'));

      // Mobile: no pin. Fade the scene as the hero scrolls away.
      if (mobile) {
        const ctx = gsap.context(() => {
          if (!sceneLayers.length) return;
          gsap.to(sceneLayers, {
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
          });
        }, root);
        teardown = () => ctx.revert();
        return;
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
      let pinStart = () => 0;

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
            // The header reads this: it never hides during the pin
            onToggle: (self) => setHeroPinned(self.isActive),
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
        if (sceneLayers.length) tl.to(sceneLayers, { opacity: 0.15, duration: 0.2 }, 0.8);
        tl.set({}, {}, 1); // timeline spans exactly p 0 → 1

        pinStart = () => tl.scrollTrigger?.start ?? 0;
        // "Enter the lab" and nav "Work" land at the end of the pin (§11.3)
        unregister = registerScrollTarget('projects', () => tl.scrollTrigger?.end ?? 0);
      }, root);

      // Keyboard: the pinned copy is faded out mid-pin, so tabbing into it
      // returns to the start of the pin where it is fully visible (§13).
      const onFocusIn = (e: FocusEvent) => {
        if (!(e.target instanceof Element) || !e.target.closest('[data-hero-copy]')) return;
        if (window.scrollY > pinStart() + 2) scrollToPosition(pinStart(), { immediate: true });
      };
      root.addEventListener('focusin', onFocusIn);

      teardown = () => {
        root.removeEventListener('focusin', onFocusIn);
        unregister();
        ScrollTrigger.removeEventListener('refreshInit', setRunway);
        ctx.revert();
        runway.style.height = '0px';
        sceneState.scrollProgress = 0;
        setHeroPinned(false);
      };
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [scope, runwayRef, mobile, reducedMotion]);
}
