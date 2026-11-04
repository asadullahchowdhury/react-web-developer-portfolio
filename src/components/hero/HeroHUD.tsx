import { heroHud } from './heroContent';

/** Chapter counter, location/status and scroll cue along the bottom of the hero (spec §2.2, §3.4). */
const HeroHUD = () => (
  <div data-intro="hud" className="flex items-end justify-between gap-4 pb-[18px] pt-4 font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:pb-8 md:pt-6 md:text-hud">
    {/* Mobile */}
    <p className="md:hidden">{heroHud.mobile.chapter}</p>
    <p className="text-right md:hidden">{heroHud.mobile.status}</p>

    {/* Tablet and up */}
    <p className="hidden md:block">
      {/* Counter swaps 01 → 02 at the hand-off; the rest of the HUD fades on scroll */}
      <span className="inline-grid">
        <span data-hud-chapter="current" className="[grid-area:1/1]">
          {heroHud.desktop.chapter}
        </span>
        <span data-hud-chapter="next" aria-hidden="true" className="opacity-0 [grid-area:1/1]">
          {heroHud.desktop.chapterNext}
        </span>
      </span>
      <span data-hud-fade>
        <span aria-hidden="true"> — </span>
        {heroHud.desktop.status}
      </span>
    </p>
    <p data-hud-fade className="hidden items-start gap-3 md:flex">
      <span>{heroHud.scroll}</span>
      <span aria-hidden="true" className="relative -mt-2.5 block h-8 w-px bg-white/10">
        <span data-hud-progress className="absolute inset-x-0 top-0 block h-1/2 bg-ink-primary" />
      </span>
    </p>
  </div>
);

export default HeroHUD;
