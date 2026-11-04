import { useRef } from 'react';
import HeroBackdrop from './HeroBackdrop';
import HeroCopy from './HeroCopy';
import HeroHUD from './HeroHUD';
import HeroStage from './HeroStage';
import { useHeroIntro } from './useHeroIntro';
import { useHeroParallax } from './useHeroParallax';
import { useHeroScroll } from './useHeroScroll';

/**
 * Hero — "Rahat's Digital Lab" (hero-redesign-spec §2–3, §9–11).
 *
 * Layout: flex column of [header spacer] / grid (flex 1) / HUD.
 * The site header is the global fixed <Header />, so the top padding reserves its height.
 * The runway after the section sets how far the pin runs before Work arrives.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  useHeroIntro(sectionRef);
  useHeroParallax(sectionRef);
  useHeroScroll(sectionRef, runwayRef);

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        aria-label="Introduction"
        className="relative flex min-h-[100svh] flex-col overflow-x-clip bg-void pt-[76px] md:min-h-[max(100svh,760px)] md:pt-[100px]"
      >
        <HeroBackdrop />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 md:px-8 lg:px-12 xl:px-16">
          <div className="grid flex-1 grid-cols-1 content-start items-center gap-[18px] md:content-center md:gap-8 lg:grid-cols-2 xl:gap-12">
            <div className="lg:order-last">
              <HeroStage />
            </div>
            <HeroCopy />
          </div>

          <HeroHUD />
        </div>
      </section>
      {/* Height is measured by useHeroScroll; 0 without a pin */}
      <div ref={runwayRef} data-hero-runway aria-hidden="true" className="h-0" />
    </>
  );
};

export default Hero;
