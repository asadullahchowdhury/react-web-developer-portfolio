import { type RefObject, useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab inside `container` while `active`, closes on Escape,
 * focuses the first focusable element on open, and returns focus to
 * `returnFocus` on close.
 */
export function useFocusTrap(
  container: RefObject<HTMLElement>,
  active: boolean,
  onEscape: () => void,
  returnFocus: RefObject<HTMLElement>,
) {
  useEffect(() => {
    const root = container.current;
    if (!active || !root) return;

    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const toReturn = returnFocus.current;
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Next frame: the opener may still be inside an inert region at this
      // point in the commit (the page behind the dialog is made inert).
      requestAnimationFrame(() => toReturn?.focus());
    };
  }, [container, active, onEscape, returnFocus]);
}
