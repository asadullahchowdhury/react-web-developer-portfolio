import type { MouseEvent } from 'react';
import { scrollToId } from '../../lib/scroll';
import { heroCopy } from './heroContent';

const HeroCopy = () => {
  const { label, headline, lead, primaryCta, secondaryCta, proof } = heroCopy;

  const onEnterLab = (e: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToId(primaryCta.target)) e.preventDefault();
  };

  return (
    <div data-hero-copy className="flex w-full max-w-[560px] flex-col gap-[18px] md:gap-8">
      <p data-intro="label" className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-signal md:text-label">
        {label}
      </p>

      <h1 data-intro="headline" className="text-[34px] font-medium leading-[1.05] tracking-[-0.045em] text-ink-primary md:text-[48px] md:leading-[1.02] lg:text-[56px] xl:text-display-xl">
        {headline.lead} <span className="text-ink-tertiary">{headline.trail}</span>
      </h1>

      <p data-intro="lead" className="max-w-[490px] text-body leading-[1.55] text-ink-secondary md:text-lead lg:text-[17px] xl:text-lead">
        <span className="md:hidden">{lead.short}</span>
        <span className="hidden md:inline">{lead.full}</span>
      </p>

      <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
        <a
          href={`#${primaryCta.target}`}
          onClick={onEnterLab}
          data-intro="cta"
          className="inline-flex h-[52px] items-center justify-center rounded-full bg-ink-primary px-6 text-button text-void transition-colors duration-200 hover:bg-white md:h-[50px]"
        >
          {primaryCta.label}
        </a>
        <a
          href={secondaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
          data-intro="cta"
          className="inline-flex h-[52px] items-center justify-center rounded-full border border-strong px-[22px] text-button text-ink-primary transition-colors duration-200 hover:border-white/[0.28] md:h-[50px]"
        >
          {secondaryCta.label}
        </a>
      </div>

      <p data-intro="proof" className="hidden font-mono text-mono-sm text-ink-tertiary md:block">
        {proof.prefix}{' '}
        {proof.projects.map((name, i) => (
          <span key={name}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            <span className="text-ink-body">{name}</span>
          </span>
        ))}
      </p>
    </div>
  );
};

export default HeroCopy;
