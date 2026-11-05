import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/capabilities';

/** Live `prefers-reduced-motion` (plus the dev-only `?motion=reduce` override). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(prefersReducedMotion());
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
