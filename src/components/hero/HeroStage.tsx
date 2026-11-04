import GlassPanel from './GlassPanel';
import ScenePoster from './ScenePoster';
import { deployPanel, heroCopy, schemaPanel } from './heroContent';

/**
 * Square box that holds the 3D scene. Its size is reserved from first paint
 * so the canvas can replace the poster with zero layout shift (spec §3.1).
 *
 * Sizes: mobile full width × 330 · tablet square ≤ 520 · laptop ≤ 560 · desktop ≤ 680.
 */
const HeroStage = () => (
  <div className="relative -mt-1.5 h-[330px] w-full md:mx-auto md:mt-0 md:aspect-square md:h-auto md:max-w-[520px] lg:mr-0 lg:max-w-[560px] xl:max-w-[680px]">
    <ScenePoster />
    {/* LabCanvas mounts here in the canvas step */}

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

export default HeroStage;
