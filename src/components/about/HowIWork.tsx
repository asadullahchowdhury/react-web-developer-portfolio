import { useEffect, useLayoutEffect, useRef } from 'react';
import { ABOUT } from '../../data/about';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { hasFinePointer } from '../../lib/capabilities';
import { gsap } from '../../lib/motion';
import { loadScrollLibs } from '../../lib/scroll';

/** Desktop: the line runs 44 px below the top of the list (centre of the 88 px node row). */
const LINE_Y = 44;
/** Node centre on the vertical (mobile / tablet) line. */
const LINE_X = 11;
const PACKET = 9;

/**
 * "How I work" as a pipeline (About). Desktop ≥ 1024 px: three columns on one
 * horizontal line; below that the steps stack on a vertical line at the left.
 *
 * Scroll (fine pointer, motion allowed): a light trail grows along the line,
 * scrubbed from the list's top at 80% of the viewport to its bottom at 50%.
 * A packet rides at its tip; each node it reaches activates (signal colours)
 * and its title and body fade up 12 px. Fully reversible, no pin.
 * Reduced motion / touch: full line in signal blue, every step active.
 *
 * The line, trail, packet and node shapes are aria-hidden; the steps are a
 * real <ol>, read in order.
 */
const HowIWork = () => {
  const list = useRef<HTMLOListElement>(null);
  const trail = useRef<HTMLSpanElement>(null);
  const packet = useRef<HTMLSpanElement>(null);

  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const scrub = !reduced && hasFinePointer();

  // Line geometry: across the whole list on desktop, from the first node
  // centre to the last on the vertical layout. Written as CSS variables.
  useLayoutEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const measure = () => {
      if (desktop) {
        ol.style.setProperty('--pl-start', '0px');
        ol.style.setProperty('--pl-len', `${ol.clientWidth}px`);
        return;
      }
      const nodes = ol.querySelectorAll<HTMLElement>('[data-pipeline-node]');
      if (!nodes.length) return;
      const top = ol.getBoundingClientRect().top;
      const centre = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top - top + r.height / 2;
      };
      const start = centre(nodes[0]);
      ol.style.setProperty('--pl-start', `${start}px`);
      ol.style.setProperty('--pl-len', `${centre(nodes[nodes.length - 1]) - start}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ol);
    return () => observer.disconnect();
  }, [desktop]);

  // Scrubbed trail, packet and node activation
  useEffect(() => {
    const ol = list.current;
    const tr = trail.current;
    const pk = packet.current;
    if (!ol || !tr || !pk || !scrub) return;

    const steps = Array.from(ol.querySelectorAll<HTMLElement>('[data-pipeline-step]'));
    const nodes = steps.map((s) => s.querySelector<HTMLElement>('[data-pipeline-node]'));
    let cancelled = false;
    let teardown = () => {};

    const paint = (progress: number) => {
      // The vertical line ends exactly at the last node, so there the trail
      // completes at 90% of the scroll range and holds, giving the last step
      // time on screen; the horizontal line runs the whole range
      const p = desktop ? progress : Math.min(1, progress / 0.9);
      const olRect = ol.getBoundingClientRect();
      const start = parseFloat(ol.style.getPropertyValue('--pl-start')) || 0;
      const len = parseFloat(ol.style.getPropertyValue('--pl-len')) || 0;
      const tip = start + p * len;

      tr.style.transform = desktop ? `scaleX(${p})` : `scaleY(${p})`;
      pk.style.opacity = p > 0.001 && p < 0.999 ? '1' : '0';
      pk.style.transform = desktop
        ? `translate(${tip - PACKET / 2}px, ${LINE_Y - PACKET / 2}px)`
        : `translate(${LINE_X - PACKET / 2}px, ${tip - PACKET / 2}px)`;

      // A step is active once the tip reaches its node's edge (the last node
      // sits at the very end of the vertical line)
      steps.forEach((step, i) => {
        const node = nodes[i];
        if (!node) return;
        const r = node.getBoundingClientRect();
        const centre = desktop ? r.left - olRect.left + r.width / 2 : r.top - olRect.top + r.height / 2;
        step.dataset.active = String(p > 0.001 && tip >= centre - LINE_X);
      });
    };

    loadScrollLibs().then(() => {
      if (cancelled) return;
      const state = { p: 0 };
      const ctx = gsap.context(() => {
        gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: () => paint(state.p),
          scrollTrigger: { trigger: ol, start: 'top 80%', end: 'bottom 50%', scrub: 0.4, invalidateOnRefresh: true },
        });
      }, ol);
      paint(state.p);
      teardown = () => {
        ctx.revert();
        tr.style.transform = '';
        pk.style.opacity = '';
        pk.style.transform = '';
        steps.forEach((s) => (s.dataset.active = 'true'));
      };
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [desktop, scrub]);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <h3 data-reveal="fade" className="font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-signal">
        {ABOUT.principlesLabel}
      </h3>

      <ol ref={list} className="relative flex flex-col gap-9 lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Decorative line, trail and packet */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[10.5px] top-[var(--pl-start)] h-[var(--pl-len)] w-px bg-[rgb(156_201_255/0.25)] lg:left-0 lg:top-[43.5px] lg:h-px lg:w-[var(--pl-len)]"
        />
        <span
          ref={trail}
          aria-hidden="true"
          className={`pointer-events-none absolute left-[10.5px] top-[var(--pl-start)] h-[var(--pl-len)] w-px origin-top lg:left-0 lg:top-[43.5px] lg:h-px lg:w-[var(--pl-len)] lg:origin-left ${
            scrub
              ? 'bg-gradient-to-b from-transparent to-signal lg:bg-gradient-to-r'
              : 'bg-signal'
          }`}
        />
        {scrub && (
          <span
            ref={packet}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 h-[9px] w-[9px] rounded-full bg-[#EDF4FF] opacity-0 shadow-[0_0_12px_#9CC9FF]"
          />
        )}

        {ABOUT.principles.map((p) => (
          <li key={p.number} data-pipeline-step data-active="true" className="group relative flex flex-col gap-[22px]">
            {/* Node row: 22 px on the vertical layout, 88 px with the line through its middle on desktop */}
            <div className="relative flex h-[22px] items-center lg:h-[88px]">
              <span
                data-pipeline-node
                aria-hidden="true"
                className="relative z-[1] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border border-white/25 bg-graphite transition-colors duration-300 ease-lab group-data-[active=true]:border-signal"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/35 transition-colors duration-300 ease-lab group-data-[active=true]:bg-signal" />
              </span>
              <span className="relative z-[1] ml-[10px] bg-void px-2 font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-ink-tertiary transition-colors duration-300 ease-lab group-data-[active=true]:text-signal">
                {p.number} / {p.label}
              </span>
            </div>

            <div className="flex translate-y-3 flex-col gap-[22px] pl-10 opacity-0 transition-[opacity,transform] duration-300 ease-lab group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 lg:pl-0">
              <h4 className="text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-ink-primary">
                {p.title.lead} <span className="text-ink-tertiary">{p.title.tail}</span>
              </h4>
              <p className="max-w-[360px] text-[16px] leading-[1.6] text-ink-secondary">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default HowIWork;
