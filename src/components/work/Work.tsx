import { useRef } from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { PUBLISHED_PROJECTS } from '../../data/projects';
import { chapterLabel, SITE } from '../../data/site';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReveal } from '../../hooks/useReveal';
import { useSceneMode } from '../hero/useSceneMode';
import ProjectCard from './ProjectCard';
import { useWorkScroll } from './useWorkScroll';

const TITLE = { lead: "Products I've built", trail: 'end to end.' };
const LEAD = 'From database schema to deployed interface. Each one shipped and used by real teams.';
const LEAD_MOBILE = 'From database schema to deployed interface.';

const hud = `${chapterLabel('projects')} — Selected work`;
const total = String(PUBLISHED_PROJECTS.length).padStart(2, '0');

/**
 * Selected Work (spec §3.5, §11.2, §12, §15).
 * Desktop: top bar, 360 px left column + horizontal track that bleeds off the
 * right edge, progress bar; the section pins and scroll moves the track.
 * Reduced motion / touch at desktop width: the track scrolls natively.
 * Below 768 px: header block, stacked cards, "More on GitHub" button.
 */
const Work = () => {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLSpanElement>(null);
  const edge = useRef<HTMLSpanElement>(null);

  const sceneMode = useSceneMode();
  const belowMd = useMediaQuery('(max-width: 767px)');
  const mode = belowMd ? 'stack' : sceneMode.mobile || sceneMode.reducedMotion ? 'native' : 'pin';

  useWorkScroll({ section, viewport, track, counter, fill, hint, edge }, mode);
  // In pin mode Work slides up over the pinned hero, so its heading rises with
  // the track as one block instead of revealing late (POLISH P1-6)
  const reveal = (kind: 'lines' | 'fade') => (mode === 'pin' ? undefined : kind);
  useReveal(section);

  return (
    <section
      ref={section}
      id="projects"
      aria-labelledby="work-title"
      className="relative overflow-x-clip bg-void px-5 pb-12 pt-10 md:flex md:min-h-[100svh] md:flex-col md:px-0 md:py-0"
    >
      {/* Top bar (desktop) */}
      <p className="hidden px-12 pb-6 pt-8 font-mono text-hud uppercase text-ink-tertiary md:block xl:px-16">{hud}</p>

      <div className="flex flex-col gap-7 md:grid md:flex-1 md:grid-cols-[minmax(0,320px)_1fr] md:items-center md:gap-12 md:pl-12 xl:grid-cols-[360px_1fr] xl:gap-16 xl:pl-16">
        {/* Left column */}
        <div className="relative z-10 flex flex-col gap-7">
          <p data-reveal={reveal('fade')} className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:hidden">
            {hud}
          </p>
          <p data-reveal={reveal('fade')} className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-signal md:text-label">
            Selected work
          </p>
          <h2
            id="work-title"
            data-reveal={reveal('lines')}
            className="text-[34px] font-medium leading-[1.05] tracking-[-0.04em] text-ink-primary md:text-display-lg"
          >
            {TITLE.lead} <span className="text-ink-tertiary">{TITLE.trail}</span>
          </h2>
          <p data-reveal={reveal('fade')} className="max-w-[320px] text-[15px] leading-[1.55] text-ink-secondary md:text-body">
            <span className="md:hidden">{LEAD_MOBILE}</span>
            <span className="hidden md:inline">{LEAD}</span>
          </p>
          <div data-reveal={reveal('fade')} className="hidden items-center gap-5 md:flex" aria-hidden="true">
            <span className="font-mono text-counter text-ink-primary">
              <span ref={counter}>01</span>
              <span className="ml-2 text-[14px] tracking-normal text-ink-tertiary">/ {total}</span>
            </span>
            <span className="h-8 w-px bg-white/10" />
            <span
              ref={hint}
              className="inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-tertiary transition-opacity duration-300 ease-lab"
            >
              Scroll <ArrowRight size={14} strokeWidth={1.75} />
            </span>
          </div>
        </div>

        {/* Track window */}
        <div
          ref={viewport}
          className={`relative min-w-0 ${
            mode === 'native'
              ? 'overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:thin]'
              : mode === 'pin'
                ? 'overflow-x-clip'
                : ''
          }`}
          role={mode === 'native' ? 'region' : undefined}
          aria-label={mode === 'native' ? 'Projects' : undefined}
          tabIndex={mode === 'native' ? 0 : undefined}
        >
          {mode === 'pin' && (
            <span
              ref={edge}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent opacity-0"
            />
          )}
          <div
            ref={track}
            className="flex flex-col gap-4 will-change-transform md:w-max md:flex-row md:items-start md:gap-6 md:pr-12 xl:pr-16"
          >
            {PUBLISHED_PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress (desktop) */}
      <div className="hidden items-center gap-6 px-12 pb-10 pt-9 md:flex xl:px-16">
        <span aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-white/10">
          <span ref={fill} className="absolute inset-0 origin-left scale-x-0 bg-ink-primary" />
        </span>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-nav text-ink-secondary transition-colors hover:text-ink-primary"
        >
          More on GitHub <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>

      {/* Mobile: GitHub button */}
      <a
        href={SITE.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-strong text-button text-ink-primary md:hidden"
      >
        <Github size={16} strokeWidth={1.75} aria-hidden="true" />
        More on GitHub
      </a>
    </section>
  );
};

export default Work;
