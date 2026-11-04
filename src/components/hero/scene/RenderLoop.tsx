import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { sceneState } from './sceneState';

export type Frameloop = 'always' | 'demand' | 'never';

/**
 * Runs the render loop only while it matters (spec §13):
 * stops when the canvas is off-screen or the tab is hidden, and resumes
 * with a fresh frame when it comes back.
 *
 * `animate` — continuous frames for intro/idle motion; when false
 * (reduced motion) the scene only renders on demand.
 *
 * The mode is reported through `onChange` and held as <Canvas> state:
 * <Canvas> re-applies its `frameloop` prop whenever it re-renders, so
 * calling setFrameloop directly would be overwritten.
 */
const RenderLoop = ({ animate, onChange }: { animate: boolean; onChange: (mode: Frameloop) => void }) => {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let onScreen = true;
    let tabVisible = document.visibilityState === 'visible';

    const apply = () => {
      const active = onScreen && tabVisible;
      sceneState.rendering = active;
      onChange(active ? (animate ? 'always' : 'demand') : 'never');
      if (active) invalidate();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        apply();
      },
      { threshold: 0 },
    );
    observer.observe(gl.domElement);

    const onVisibility = () => {
      tabVisible = document.visibilityState === 'visible';
      apply();
    };
    document.addEventListener('visibilitychange', onVisibility);

    apply();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [gl, invalidate, animate, onChange]);

  return null;
};

export default RenderLoop;
