import type { ReactNode } from 'react';
import { type ChapterSection, chapterLabel } from '../../data/site';

interface SectionHeaderProps {
  /** Section id for the chapter counter (spec §2.3). */
  section: ChapterSection;
  /** Name after the counter in the HUD line, e.g. "About". Omit to hide the HUD line. */
  hudName?: string;
  eyebrow: string;
  title: { lead: string; trail?: string };
  lead?: ReactNode;
  /** Shorter lead shown below 768 px, when the spec gives one. */
  leadMobile?: ReactNode;
  /** Heading id, for aria-labelledby on the section. */
  titleId?: string;
  className?: string;
}

/**
 * Section header pattern (spec §18): HUD line (`NN / 04 — Name`) → eyebrow
 * (signal) → H2 52 px (34 px mobile) with a tertiary second clause → lead.
 * Carries `data-reveal` hooks for useReveal.
 */
const SectionHeader = ({
  section,
  hudName,
  eyebrow,
  title,
  lead,
  leadMobile,
  titleId,
  className = '',
}: SectionHeaderProps) => (
  <div className={`flex flex-col gap-5 md:gap-7 ${className}`}>
    {hudName && (
      <p data-reveal="fade" className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:text-hud">
        {chapterLabel(section)} — {hudName}
      </p>
    )}
    <p data-reveal="fade" className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-signal md:text-label">
      {eyebrow}
    </p>
    <h2
      id={titleId}
      data-reveal="lines"
      className="text-[34px] font-medium leading-[1.05] tracking-[-0.04em] text-ink-primary md:text-display-lg"
    >
      {title.lead}
      {title.trail && (
        <>
          {' '}
          <span className="text-ink-tertiary">{title.trail}</span>
        </>
      )}
    </h2>
    {lead && (
      <p data-reveal="fade" className="text-[15px] leading-[1.55] text-ink-secondary md:text-body">
        {leadMobile ? (
          <>
            <span className="md:hidden">{leadMobile}</span>
            <span className="hidden md:inline">{lead}</span>
          </>
        ) : (
          lead
        )}
      </p>
    )}
  </div>
);

export default SectionHeader;
