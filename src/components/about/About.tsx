import { useRef } from 'react';
import { ABOUT } from '../../data/about';
import { chapterLabel } from '../../data/site';
import { useReveal } from '../../hooks/useReveal';
import HowIWork from './HowIWork';
import Portrait from './Portrait';

/**
 * About (spec §17). Desktop: HUD → statement + body | portrait (1.5fr / 1fr,
 * aligned to the bottom) → four facts → "How I work" pipeline.
 * Mobile: HUD → statement → portrait → first sentence of the body → facts as
 * a ruled list → stacked pipeline steps.
 */
const About = () => {
  const section = useRef<HTMLElement>(null);
  useReveal(section);

  return (
    <section
      ref={section}
      id="about"
      aria-labelledby="about-title"
      className="relative bg-void px-5 pb-14 pt-10 md:px-12 md:pb-24 md:pt-8 xl:px-16"
    >
      <div className="mx-auto flex max-w-[1312px] flex-col gap-8 md:gap-[72px]">
        <p data-reveal="fade" className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:text-hud">
          {chapterLabel('about')} — About
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-12 lg:gap-20">
          <div className="flex flex-col gap-8">
            <p data-reveal="fade" className="hidden font-mono text-label uppercase text-signal md:block">
              {ABOUT.eyebrow}
            </p>
            <h2
              id="about-title"
              data-reveal="lines"
              className="text-[28px] font-normal leading-[1.18] tracking-[-0.03em] text-ink-primary md:text-[36px] md:leading-[1.12] lg:text-[46px]"
            >
              {ABOUT.statement.lead} <span className="text-ink-tertiary">{ABOUT.statement.trail}</span>
            </h2>
            <p data-reveal="fade" className="hidden max-w-[600px] text-[17px] leading-[1.65] text-ink-secondary md:block">
              {ABOUT.body.full}
            </p>
          </div>

          <Portrait />

          {/* Mobile: body (first sentence) sits after the portrait */}
          <p data-reveal="fade" className="text-[15px] leading-[1.6] text-ink-secondary md:hidden">
            {ABOUT.body.firstSentence}
          </p>
        </div>

        {/* Facts */}
        <dl className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
          {ABOUT.facts.map((fact) => (
            <div
              key={fact.label}
              data-reveal="fade"
              className="flex flex-col gap-2 border-t border-white/[0.12] py-4 md:gap-3 md:pb-0 md:pt-[22px]"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">{fact.label}</dt>
              <dd className="flex items-center gap-2.5 text-[18px] font-medium leading-[1.3] text-ink-primary md:text-[22px]">
                {'available' in fact && fact.available && (
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ember" />
                )}
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* How I work */}
        <HowIWork />
      </div>
    </section>
  );
};

export default About;
