import { lazy, Suspense } from 'react';
import NodeLabels from './NodeLabels';
import SceneErrorBoundary from './SceneErrorBoundary';
import type { LabCanvasControl } from './useLabCanvas';

const LabCanvas = lazy(() => import('./scene/LabCanvas'));

/** The lazy R3F canvas plus its DOM labels, faded in once the first frame is drawn. */
const SceneCanvas = ({ control }: { control: LabCanvasControl }) => {
  if (!control.showCanvas) return null;
  return (
    <div
      className="absolute inset-0 transition-opacity ease-linear"
      style={{ opacity: control.canvasVisible ? 1 : 0, transitionDuration: `${control.fadeMs}ms` }}
    >
      <SceneErrorBoundary onError={control.onFailure}>
        <Suspense fallback={null}>
          <LabCanvas
            mobile={control.mobile}
            reducedMotion={control.reducedMotion}
            onReady={control.onReady}
            onContextLost={control.onFailure}
          />
        </Suspense>
      </SceneErrorBoundary>
      <NodeLabels />
    </div>
  );
};

export default SceneCanvas;
