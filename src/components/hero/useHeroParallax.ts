import { type RefObject, useEffect } from 'react';
import { hasFinePointer, isMobileLike, prefersReducedMotion } from '../../lib/capabilities';
import { gsap } from '../../lib/motion';
import { type SpringState, SPRING_OMEGA, SPRING_OMEGA_RELEASE, springSettled, springStep } from '../../lib/spring';
import { sceneState } from './scene/sceneState';

/** DOM layer offsets in px per unit of pointer (spec §10). */
const LAYERS = [
  { selector: '[data-panel="deploy"] [data-panel-parallax]', x: 18, y: 12 }, // near
  { selector: '[data-panel="schema"] [data-panel-parallax]', x: 8, y: 5 }, // far
  { selector: '[data-key-light]', x: 10, y: 6 },
] as const;

/** Mouse influence fades out over the first 35% of the hero pin (spec §10). */
const SCROLL_FADE_END = 0.35;

/**
 * Mouse parallax (spec §10). Desktop only: fine pointer with hover, 768px
 * and wider, and off with reduced motion.
 *
 * The pointer is normalised across the whole viewport, smoothed with a
 * critically damped spring (never set straight from the event), faded by
 * scroll, and published to `sceneState.pointer` for the 3D scene. The DOM
 * layers are moved here, so they work even without WebGL.
 */
export function useHeroParallax(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = scope.current;
    // Off on mobile (below 768px or coarse pointer, spec §12), without a
    // hover-capable fine pointer, and with reduced motion
    if (!root || isMobileLike() || !hasFinePointer() || prefersReducedMotion()) return;

    const layers = LAYERS.map((l) => ({ ...l, el: root.querySelector<HTMLElement>(l.selector) }));
    const target = { x: 0, y: 0 };
    const sx: SpringState = { x: 0, v: 0 };
    const sy: SpringState = { x: 0, v: 0 };
    let releasing = false;
    let last = performance.now();
    let written = { x: NaN, y: NaN };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      releasing = false;
    };
    const release = () => {
      target.x = 0;
      target.y = 0;
      releasing = true;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) release(); // left the window
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const omega = releasing ? SPRING_OMEGA_RELEASE : SPRING_OMEGA;
      springStep(sx, target.x, omega, dt);
      springStep(sy, target.y, omega, dt);

      const influence = 1 - Math.min(Math.max(sceneState.scrollProgress / SCROLL_FADE_END, 0), 1);
      const x = sx.x * influence;
      const y = sy.x * influence;

      // Skip DOM writes once everything has come to rest
      if (springSettled(sx, target.x) && springSettled(sy, target.y) && x === written.x && y === written.y) return;
      written = { x, y };
      sceneState.pointer.x = x;
      sceneState.pointer.y = y;
      for (const layer of layers) {
        if (layer.el) layer.el.style.transform = `translate3d(${x * layer.x}px, ${y * layer.y}px, 0)`;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', release);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', release);
      gsap.ticker.remove(tick);
      sceneState.pointer.x = 0;
      sceneState.pointer.y = 0;
      for (const layer of layers) if (layer.el) layer.el.style.transform = '';
    };
  }, [scope]);
}
