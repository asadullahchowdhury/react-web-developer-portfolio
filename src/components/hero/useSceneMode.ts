import { useEffect, useState } from 'react';
import { hasFinePointer, isMobileLike, prefersReducedMotion } from '../../lib/capabilities';

export interface SceneMode {
  /** Below 768px or coarse pointer (spec §12). */
  mobile: boolean;
  reducedMotion: boolean;
  /** Fine pointer with hover — mouse parallax and node hover (spec §10). */
  finePointer: boolean;
}

const QUERIES = [
  '(max-width: 767px)',
  '(pointer: coarse)',
  '(pointer: fine) and (hover: hover)',
  '(prefers-reduced-motion: reduce)',
];

const read = (): SceneMode => ({
  mobile: isMobileLike(),
  reducedMotion: prefersReducedMotion(),
  finePointer: hasFinePointer(),
});

/**
 * Live device mode for the hero. Updates when the window crosses 768px, the
 * pointer type changes or reduced motion is toggled, so the pin, parallax
 * and canvas layout switch without a reload.
 */
export function useSceneMode(): SceneMode {
  const [mode, setMode] = useState<SceneMode>(read);

  useEffect(() => {
    const lists = QUERIES.map((q) => window.matchMedia(q));
    const onChange = () => {
      const next = read();
      setMode((prev) =>
        prev.mobile === next.mobile &&
        prev.reducedMotion === next.reducedMotion &&
        prev.finePointer === next.finePointer
          ? prev
          : next,
      );
    };
    lists.forEach((l) => l.addEventListener('change', onChange));
    return () => lists.forEach((l) => l.removeEventListener('change', onChange));
  }, []);

  return mode;
}
