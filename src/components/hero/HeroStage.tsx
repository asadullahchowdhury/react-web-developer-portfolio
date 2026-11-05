import type { Ref } from 'react';
import GlassPanel from './GlassPanel';
import SceneCanvas from './SceneCanvas';
import ScenePoster from './ScenePoster';
import { deployPanel, heroCopy, schemaPanel } from './heroContent';
import type { LabCanvasControl } from './useLabCanvas';

interface HeroStageProps {
  control: LabCanvasControl;
  stageRef: Ref<HTMLDivElement>;
}

/**
 * Square box that holds the 3D scene. Its size is reserved from first paint
 * so the canvas can replace the poster with zero layout shift (spec §3.1).
 * In expanded mode (desktop pin) the canvas lives in the hero-wide layer and
 * this box only frames it; otherwise the canvas renders inside the box.
 *
 * Sizes: mobile full width × 330 · tablet square ≤ 520 · laptop ≤ 560 · desktop ≤ 680.
 */
const HeroStage = ({ control, stageRef }: HeroStageProps) => (
  <div
    ref={stageRef}
    data-canvas-state={control.state}
    className="pointer-events-none relative -mt-1.5 h-[330px] w-full md:mx-auto md:mt-0 md:aspect-square md:h-auto md:max-w-[520px] lg:mr-0 lg:max-w-[560px] xl:max-w-[680px]"
  >
    {/* Scene layer: faded as a whole by the scroll hand-off */}
    <div data-scene-layer className="absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity ease-linear"
        style={{ opacity: control.canvasVisible ? 0 : 1, transitionDuration: `${control.fadeMs}ms` }}
      >
        <ScenePoster />
      </div>
      {!control.expanded && <SceneCanvas control={control} />}
    </div>

    {!heroCopy.sceneDescription.includes('[PLACEHOLDER]') && (
      <p className="sr-only">{heroCopy.sceneDescription}</p>
    )}

    {/* Panel A — near layer; tablet and up */}
    <div data-panel="deploy" className="absolute right-0 top-[6%] hidden w-[166px] md:block xl:w-[184px]">
      <div data-panel-parallax>
        <div data-panel-float>
          <GlassPanel content={deployPanel} />
        </div>
      </div>
    </div>

    {/* Panel B — far layer; laptop and up */}
    <div data-panel="schema" className="absolute bottom-[4%] left-0 hidden w-[180px] lg:block xl:w-[200px]">
      <div data-panel-parallax>
        <div data-panel-float>
          <GlassPanel content={schemaPanel} />
        </div>
      </div>
    </div>
  </div>
);

export default HeroStage;
