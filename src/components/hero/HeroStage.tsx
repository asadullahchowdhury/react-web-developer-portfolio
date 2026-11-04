import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { getSceneCapabilities } from '../../lib/capabilities';
import GlassPanel from './GlassPanel';
import SceneErrorBoundary from './SceneErrorBoundary';
import ScenePoster from './ScenePoster';
import { deployPanel, heroCopy, schemaPanel } from './heroContent';

const LabCanvas = lazy(() => import('./scene/LabCanvas'));

/**
 * poster  — first paint; only the static poster is shown
 * loading — the 3D chunk is downloading / the canvas is starting
 * ready   — first frame drawn; canvas fades in over the poster
 * failed  — no WebGL, chunk error or context lost; poster stays for good
 */
type CanvasState = 'poster' | 'loading' | 'ready' | 'failed';

/** Waits for the window load event, then for the browser to be idle. */
function afterLoadAndIdle(callback: () => void): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: number | undefined;

  const scheduleIdle = () => {
    if (cancelled) return;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => !cancelled && callback(), { timeout: 1500 });
    } else {
      // Safari has no requestIdleCallback; TS types it as always present.
      timeoutId = setTimeout(() => !cancelled && callback(), 200) as unknown as number;
    }
  };

  if (document.readyState === 'complete') scheduleIdle();
  else window.addEventListener('load', scheduleIdle, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', scheduleIdle);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}

/**
 * Square box that holds the 3D scene. Its size is reserved from first paint
 * so the canvas can replace the poster with zero layout shift (spec §3.1).
 *
 * Sizes: mobile full width × 330 · tablet square ≤ 520 · laptop ≤ 560 · desktop ≤ 680.
 */
const HeroStage = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>('poster');
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const caps = getSceneCapabilities();
    setMobile(caps.mobile);
    setReducedMotion(caps.reducedMotion);
    if (!caps.webgl) {
      setCanvasState('failed');
      return;
    }
    return afterLoadAndIdle(() => setCanvasState('loading'));
  }, []);

  const handleReady = useCallback(() => setCanvasState('ready'), []);
  const handleFailure = useCallback(() => setCanvasState('failed'), []);

  const showCanvas = canvasState === 'loading' || canvasState === 'ready';
  const canvasVisible = canvasState === 'ready';
  const fadeMs = reducedMotion ? 200 : 300;

  return (
    <div
      data-canvas-state={canvasState}
      className="relative -mt-1.5 h-[330px] w-full md:mx-auto md:mt-0 md:aspect-square md:h-auto md:max-w-[520px] lg:mr-0 lg:max-w-[560px] xl:max-w-[680px]"
    >
      <div
        className="absolute inset-0 transition-opacity ease-linear"
        style={{ opacity: canvasVisible ? 0 : 1, transitionDuration: `${fadeMs}ms` }}
      >
        <ScenePoster />
      </div>

      {showCanvas && (
        <div
          className="absolute inset-0 transition-opacity ease-linear"
          style={{ opacity: canvasVisible ? 1 : 0, transitionDuration: `${fadeMs}ms` }}
        >
          <SceneErrorBoundary onError={handleFailure}>
            <Suspense fallback={null}>
              <LabCanvas mobile={mobile} onReady={handleReady} onContextLost={handleFailure} />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      )}

      <p className="sr-only">{heroCopy.sceneDescription}</p>

      {/* Panel A — near layer; tablet and up */}
      <div data-panel="deploy" className="absolute right-0 top-[6%] hidden w-[166px] md:block xl:w-[184px]">
        <GlassPanel content={deployPanel} />
      </div>

      {/* Panel B — far layer; laptop and up */}
      <div data-panel="schema" className="absolute bottom-[4%] left-0 hidden w-[180px] lg:block xl:w-[200px]">
        <GlassPanel content={schemaPanel} />
      </div>
    </div>
  );
};

export default HeroStage;
