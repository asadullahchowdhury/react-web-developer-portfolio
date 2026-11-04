import 'lenis/dist/lenis.css';
import type Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './capabilities';

gsap.registerPlugin(ScrollToPlugin);

export type ScrollTriggerStatic = typeof ScrollTriggerType;

interface ScrollLibs {
  ScrollTrigger: ScrollTriggerStatic;
  Lenis: typeof Lenis;
}

let libs: Promise<ScrollLibs> | null = null;
let lenis: Lenis | null = null;

/**
 * ScrollTrigger and Lenis are only needed once the user scrolls, so they load
 * as a separate chunk after first paint instead of in the main bundle.
 */
export function loadScrollLibs(): Promise<ScrollLibs> {
  if (!libs) {
    libs = Promise.all([import('gsap/ScrollTrigger'), import('lenis')]).then(([st, lenisModule]) => {
      gsap.registerPlugin(st.ScrollTrigger);
      if (import.meta.env.DEV) {
        (window as unknown as { __scroll: unknown }).__scroll = {
          ScrollTrigger: st.ScrollTrigger,
          target: (id: string) => targets.get(id)?.(),
        };
      }
      return { ScrollTrigger: st.ScrollTrigger, Lenis: lenisModule.default };
    });
  }
  return libs;
}

/**
 * Named scroll positions that differ from an element's offset — e.g. the
 * Work section, which must be reached at the end of the hero pin (spec §11.3).
 */
const targets = new Map<string, () => number>();

export function registerScrollTarget(id: string, resolve: () => number): () => void {
  targets.set(id, resolve);
  return () => {
    if (targets.get(id) === resolve) targets.delete(id);
  };
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker and kept in sync with
 * ScrollTrigger (spec §11). Off with reduced motion. Also refreshes
 * ScrollTrigger once fonts and images have loaded, so pin positions are
 * right after a refresh or back/forward mid-page (§11.3).
 *
 * Returns a cleanup function.
 */
export function initSmoothScroll(onRefresh?: () => void): () => void {
  let cancelled = false;
  const cleanups: (() => void)[] = [];

  loadScrollLibs().then(({ ScrollTrigger, Lenis: LenisClass }) => {
    if (cancelled) return;

    if (!prefersReducedMotion()) {
      const instance = new LenisClass({ autoRaf: false });
      lenis = instance;
      instance.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(raf);
        instance.destroy();
        if (lenis === instance) lenis = null;
      });
    }

    if (onRefresh) {
      ScrollTrigger.addEventListener('refresh', onRefresh);
      cleanups.push(() => ScrollTrigger.removeEventListener('refresh', onRefresh));
    }

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(() => !cancelled && refresh());
    if (document.readyState === 'complete') refresh();
    else {
      window.addEventListener('load', refresh, { once: true });
      cleanups.push(() => window.removeEventListener('load', refresh));
    }
  });

  return () => {
    cancelled = true;
    cleanups.forEach((fn) => fn());
  };
}

/** Scroll to a document position, through Lenis when it is running. */
export function scrollToPosition(top: number, { immediate = false } = {}) {
  const instant = immediate || prefersReducedMotion();
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4, immediate: instant, force: true });
  } else {
    gsap.to(window, { duration: instant ? 0 : 1.2, scrollTo: top, ease: 'power2.inOut' });
  }
}

/**
 * Scroll to a section by id. Uses a registered pin-aware position when one
 * exists, otherwise the element's document offset. Returns false when the
 * target is missing, so callers can fall back to the native anchor jump.
 */
export function scrollToId(id: string): boolean {
  const resolve = targets.get(id);
  const element = document.getElementById(id);
  if (!resolve && !element) return false;
  scrollToPosition(resolve ? resolve() : element!.getBoundingClientRect().top + window.scrollY);
  return true;
}
