import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { ROLES } from '../../data/experience';
import { chapterLabel, SITE } from '../../data/site';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useReveal } from '../../hooks/useReveal';
import { EASE_LAB, gsap } from '../../lib/motion';
import { loadScrollLibs } from '../../lib/scroll';
import CommitGraph, { type GraphNode } from './CommitGraph';
import { GRAPH_PATH_LENGTH } from './graphPath';
import RoleCard from './RoleCard';

const TITLE = { lead: 'From frontend', trail: 'to the full stack.' };
const LEAD =
  'Started on interfaces, led a frontend team, then took ownership of the whole product: database, APIs and UI.';

/**
 * Experience (spec §20). Desktop: sticky left column (heading + résumé) and
 * role cards with a commit graph in a 120 px gutter; the graph line draws
 * top → bottom as you scroll, each node pops and its card fades up as the
 * line reaches it. Mobile: a simple vertical timeline. Reduced motion: static.
 */
const Experience = () => {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; height: number }>({ nodes: [], height: 0 });
  const desktop = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  useReveal(section);

  // Node positions follow each card's date line (so they align at any width)
  useLayoutEffect(() => {
    const el = list.current;
    if (!el || !desktop) return;
    const measure = () => {
      // Relative to the graph's container (cards sit in positioned <li>s, so
      // offsetTop would be relative to each <li>)
      const origin = (el.parentElement ?? el).getBoundingClientRect().top;
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-role-card]'));
      const nodes = cards.map((card, i) => {
        const date = card.querySelector<HTMLElement>('[data-role-date]');
        const box = (date ?? card).getBoundingClientRect();
        const y = Math.round(box.top - origin + (date ? box.height / 2 : 34));
        return { y, lane: ROLES[i].lane, head: ROLES[i].current };
      });
      setGraph({ nodes, height: el.offsetHeight + 72 });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [desktop]);

  // Desktop drawing: line scrubbed top → bottom; nodes pop and cards fade up as it reaches them
  useEffect(() => {
    const el = list.current;
    if (!el || !desktop || reduced || !graph.nodes.length) return;
    let cancelled = false;
    let teardown = () => {};

    loadScrollLibs().then(() => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const line = el.parentElement?.querySelector<SVGPathElement>('[data-graph-line]');
        if (line) {
          gsap.set(line, { strokeDasharray: GRAPH_PATH_LENGTH });
          gsap.fromTo(
            line,
            { strokeDashoffset: GRAPH_PATH_LENGTH },
            {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
            },
          );
        }
        const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-role-card]'));
        cards.forEach((card, i) => {
          const node = el.parentElement?.querySelector(`[data-graph-node="${i}"]`);
          const trigger = { trigger: card, start: 'top 60%', toggleActions: 'play none none reverse' };
          if (node) {
            gsap.fromTo(
              node,
              { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' },
              { scale: 1, opacity: 1, duration: 0.4, ease: EASE_LAB, immediateRender: true, scrollTrigger: trigger },
            );
          }
          gsap.fromTo(
            card,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: EASE_LAB, immediateRender: true, scrollTrigger: trigger },
          );
        });
      }, el.parentElement ?? el);
      teardown = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [desktop, reduced, graph]);

  return (
    <section
      ref={section}
      id="experience"
      aria-labelledby="experience-title"
      className="relative bg-void px-5 pb-14 pt-10 md:px-12 md:pb-24 md:pt-8 xl:px-16"
    >
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:items-start md:gap-12 xl:grid-cols-[400px_1fr] xl:gap-16">
        {/* Left column (sticky on desktop) */}
        <div className="flex flex-col gap-6 md:sticky md:top-24 md:gap-7">
          <p data-reveal="fade" className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:text-hud">
            {chapterLabel('experience')} — Experience
          </p>
          <p data-reveal="fade" className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-signal md:text-label">
            Experience
          </p>
          <h2
            id="experience-title"
            data-reveal="lines"
            className="text-[34px] font-medium leading-[1.05] tracking-[-0.04em] text-ink-primary md:text-display-lg"
          >
            {TITLE.lead} <span className="text-ink-tertiary">{TITLE.trail}</span>
          </h2>
          <p data-reveal="fade" className="text-[15px] leading-[1.55] text-ink-secondary md:text-body">
            {LEAD}
          </p>
          <a
            data-reveal="fade"
            href={SITE.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-12 w-fit items-center gap-2 rounded-full border border-strong px-6 text-button text-ink-primary transition-colors hover:border-white/[0.28] md:inline-flex"
          >
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            Download résumé
          </a>
        </div>

        {/* Roles + graph */}
        <div className="relative pl-8 md:pl-[120px]">
          {/* Desktop commit graph */}
          <div className="hidden md:block">
            <CommitGraph nodes={graph.nodes} height={graph.height} />
          </div>
          {/* Mobile timeline line */}
          <span aria-hidden="true" className="absolute bottom-2 left-[9px] top-2 w-px bg-[rgb(156_201_255/0.35)] md:hidden" />

          <ol ref={list} className="flex flex-col gap-4 md:gap-8">
            {ROLES.map((role) => (
              <li key={role.id} className="relative">
                {/* Mobile dot: 12 px; HEAD filled ember */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[29px] top-[22px] h-3 w-3 rounded-full border md:hidden ${
                    role.current ? 'border-ember bg-ember' : 'border-signal bg-void'
                  }`}
                />
                <RoleCard role={role} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile: full-width résumé button */}
      <a
        href={SITE.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-strong text-button text-ink-primary md:hidden"
      >
        <Download size={16} strokeWidth={1.75} aria-hidden="true" />
        Download résumé
      </a>
    </section>
  );
};

export default Experience;
