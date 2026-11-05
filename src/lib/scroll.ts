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

const SCROLL_KEY = `scroll:${window.location.pathname}`;

/** Saved position to restore — only on reload or back/forward, never on a fresh visit. */
function takeSavedScroll(): number | null {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const saved = sessionStorage.getItem(SCROLL_KEY);
  if (!saved || !nav || (nav.type !== 'reload' && nav.type !== 'back_forward')) return null;
  return Number(saved) || 0;
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker and kept in sync with
 * ScrollTrigger (spec §11). Off with reduced motion. Also refreshes
 * ScrollTrigger once fonts and images have loaded, so pin positions are
 * right after a refresh or back/forward mid-page (§11.3).
 *
 * Returns a cleanup function.
 */
export function initSmoothScroll(): () => void {
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

    // Refresh once fonts and images are in, then put the reader back where
    // they were on reload / back-forward (pins change the page height, so the
    // browser's own restoration lands too high)
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    });
    Promise.all([document.fonts?.ready ?? Promise.resolve(), loaded]).then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const saved = takeSavedScroll();
      if (saved !== null) {
        scrollToPosition(saved, { immediate: true });
        ScrollTrigger.update();
      }
    });
  });

  // Manual scroll restoration: remember the position when leaving the page
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const save = () => sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
  window.addEventListener('pagehide', save);
  cleanups.push(() => window.removeEventListener('pagehide', save));

  return () => {
    cancelled = true;
    cleanups.forEach((fn) => fn());
  };
}

/**
 * Pinned sections currently holding the viewport (hero, work, stack…).
 * The header never hides while any pin is active.
 */
const activePins = new Set<string>();
export const setPinActive = (key: string, active: boolean) => {
  if (active) activePins.add(key);
  else activePins.delete(key);
};
export const isPinActive = () => activePins.size > 0;

/**
 * Locks page scrolling (e.g. full-screen menu): pauses Lenis and stops native
 * scroll. `unlockScroll` restores both.
 */
export function lockScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  document.documentElement.style.overflow = '';
  lenis?.start();
}

/**
 * True while a scroll started by navigation (links, "Enter the lab") is
 * running, so the header doesn't treat it as the reader scrolling down.
 */
let navigating = false;
let navigatingTimer: number | undefined;
export const isNavigating = () => navigating;
const endNavigating = () => {
  window.clearTimeout(navigatingTimer);
  // A beat after arrival, so the last scroll events still count as navigation
  navigatingTimer = window.setTimeout(() => (navigating = false), 150);
};

/** Scroll to a document position, through Lenis when it is running. */
export function scrollToPosition(top: number, { immediate = false } = {}) {
  const instant = immediate || prefersReducedMotion();
  navigating = true;
  window.clearTimeout(navigatingTimer);
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4, immediate: instant, force: true, onComplete: endNavigating });
    if (instant) endNavigating();
  } else {
    gsap.to(window, {
      duration: instant ? 0 : 1.2,
      scrollTo: top,
      ease: 'power2.inOut',
      onComplete: endNavigating,
    });
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
