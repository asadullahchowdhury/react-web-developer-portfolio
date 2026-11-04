import { type RefObject, useEffect } from 'react';

/**
 * Makes a visually hidden header state unfocusable and unclickable.
 * (React 18 has no typed `inert` prop, so it is set on the element.)
 */
export function useInert(ref: RefObject<HTMLElement>, inert: boolean) {
  useEffect(() => {
    if (ref.current) ref.current.inert = inert;
  }, [ref, inert]);
}
