import { hasFinePointer, prefersReducedMotion } from './capabilities';

/**
 * Pointer effects (POLISH P2-11, P2-12, P2-15), one delegated listener for
 * the whole page. Desktop fine pointers only; nothing with reduced motion.
 *
 *  - `[data-magnetic]`: moves up to 6 px toward the pointer while it is within
 *    60 px of the element, springs back when it leaves. Uses the CSS
 *    `translate` property, so it never fights GSAP transforms (hero intro).
 *  - `[data-spotlight]`: receives `--mx` / `--my` (px, element-relative) for
 *    the CSS radial highlight in index.css.
 *  - `[data-pointer-glow]`: receives `--px` / `--py` (px, viewport) for
 *    effects that follow the pointer anywhere over the page.
 */

const MAGNET_RADIUS = 60;
const MAGNET_PULL = 6;

export function initPointerEffects(): () => void {
  if (!hasFinePointer() || prefersReducedMotion()) return () => {};

  let frame = 0;
  let last: PointerEvent | null = null;
  const active = new Set<HTMLElement>();

  const update = () => {
    frame = 0;
    const e = last;
    if (!e) return;

    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const r = el.getBoundingClientRect();
      // Distance from the pointer to the button's edge (0 inside it)
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const dist = Math.hypot(dx, dy);
      if (dist > MAGNET_RADIUS || r.width === 0) {
        if (active.delete(el)) el.style.translate = '';
        return;
      }
      active.add(el);
      const cx = e.clientX - (r.left + r.width / 2);
      const cy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(cx, cy) || 1;
      const strength = MAGNET_PULL * (1 - dist / MAGNET_RADIUS);
      const reach = Math.min(1, len / (Math.max(r.width, r.height) / 2));
      el.style.translate = `${((cx / len) * strength * reach).toFixed(2)}px ${((cy / len) * strength * reach).toFixed(2)}px`;
    });

    const spot = (e.target as Element | null)?.closest?.<HTMLElement>('[data-spotlight]');
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    }

    document.querySelectorAll<HTMLElement>('[data-pointer-glow]').forEach((el) => {
      el.style.setProperty('--px', `${e.clientX}px`);
      el.style.setProperty('--py', `${e.clientY}px`);
    });
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    last = e;
    if (!frame) frame = requestAnimationFrame(update);
  };
  const onLeave = () => {
    active.forEach((el) => (el.style.translate = ''));
    active.clear();
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  return () => {
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(frame);
    onLeave();
  };
}
