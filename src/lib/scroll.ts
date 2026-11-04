import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './capabilities';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

let lenis: Lenis | null = null;

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
  const cleanups: (() => void)[] = [];

  if (!prefersReducedMotion()) {
    const instance = new Lenis({ autoRaf: false });
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
  document.fonts?.ready.then(refresh);
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
  cleanups.push(() => window.removeEventListener('load', refresh));

  return () => cleanups.forEach((fn) => fn());
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

  const top = resolve ? resolve() : element!.getBoundingClientRect().top + window.scrollY;
  const instant = prefersReducedMotion();

  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4, immediate: instant, force: true });
  } else {
    gsap.to(window, { duration: instant ? 0 : 1.2, scrollTo: top, ease: 'power2.inOut' });
  }
  return true;
}

// Dev-only handle for inspecting scroll positions from the browser console
if (import.meta.env.DEV) {
  (window as unknown as { __scroll: unknown }).__scroll = {
    ScrollTrigger,
    target: (id: string) => targets.get(id)?.(),
  };
}

export { ScrollTrigger };
