import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Smooth-scroll to a section by id. Returns false when the target is missing,
 * so callers can fall back to the native anchor jump.
 * Becomes pin-aware (Lenis + ScrollTrigger) in the scroll step.
 */
export function scrollToId(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;
  gsap.to(window, {
    duration: prefersReducedMotion() ? 0 : 1.2,
    scrollTo: element,
    ease: 'power2.inOut',
  });
  return true;
}
