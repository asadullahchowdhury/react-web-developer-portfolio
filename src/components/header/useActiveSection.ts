import { useEffect, useState } from 'react';

/** A section is active once its top passes this fraction of the viewport. */
const ACTIVE_LINE = 0.4;

/**
 * Id of the section under the 40% line of the viewport, in page order.
 * Missing sections are skipped, so the list can name sections that don't
 * exist yet. Recomputed once per frame at most while scrolling.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return active;
}
