import { useCallback, useRef, useState } from 'react';
import { chapterLabel } from '../../data/site';
import { STACK_LAYERS } from '../../data/stack';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReveal } from '../../hooks/useReveal';
import { useSceneMode } from '../hero/useSceneMode';
import StackDiagram from './StackDiagram';
import RollingNumber from '../ui/RollingNumber';
import { FULL_GEOMETRY, MINI_GEOMETRY } from './stackGeometry';
import { useStackScroll } from './useStackScroll';

const TITLE = { lead: 'One product, four layers.', trail: 'I work across all of them.' };
const LEAD = 'Tools picked to fit together, so the interface, the application and the data behave like one system.';
const total = String(STACK_LAYERS.length).padStart(2, '0');

/**
 * Stack (spec §19). Desktop: layer index + exploded isometric diagram,
 * pinned for 160vh; scroll activates layers 01 → 04 and assembles the stack.
 * Reduced motion / touch at desktop width: the same diagram, static.
 * Below 768 px: mini diagram + layer cards with tool chips.
 * Hovering a row or a slab highlights that layer.
 */
const Stack = () => {
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [scrollActive, setScrollActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? scrollActive;

  const mode = useSceneMode();
  const belowMd = useMediaQuery('(max-width: 767px)');
  const sequence = !belowMd && !mode.mobile && !mode.reducedMotion;

  const onProgress = useCallback((p: number) => {
    if (progress.current) progress.current.style.transform = `scaleX(${p})`;
  }, []);

  useStackScroll(section, svg, FULL_GEOMETRY, sequence, setScrollActive, onProgress);
  useReveal(section);

  return (
    <section
      ref={section}
      id="skills"
      aria-labelledby="stack-title"
      className="relative bg-void px-5 pb-14 pt-10 md:flex md:min-h-[100svh] md:flex-col md:px-12 md:pb-10 md:pt-8 xl:px-16"
    >
      <p data-reveal="fade" className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:text-hud">
        {chapterLabel('skills')} — Stack
      </p>

      <div className="mt-8 grid flex-1 grid-cols-1 gap-8 md:mt-6 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-12">
        {/* Left: heading + layer index */}
        <div className="flex max-w-[480px] flex-col gap-7">
          <p data-reveal="fade" className="hidden font-mono text-label uppercase text-signal md:block">
            Stack
          </p>
          <h2
            id="stack-title"
            data-reveal="lines"
            className="text-[34px] font-medium leading-[1.05] tracking-[-0.04em] text-ink-primary md:text-[44px] xl:text-display-lg"
          >
            {TITLE.lead} <span className="text-ink-tertiary">{TITLE.trail}</span>
          </h2>
          <p data-reveal="fade" className="hidden text-body text-ink-secondary md:block">
            {LEAD}
          </p>

          <ol className="hidden md:block" aria-label="Layers">
            {STACK_LAYERS.map((layer, i) => {
              const isActive = i === active;
              return (
                <li
                  key={layer.number}
                  data-reveal="fade"
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex items-center gap-4 border-t border-white/[0.08] py-4 transition-colors duration-[240ms] ${
                    isActive ? 'text-ink-primary' : 'text-ink-tertiary'
                  }`}
                >
                  <span className="font-mono text-[12px]">{layer.number}</span>
                  <span className="flex-1 text-[17px]">{layer.name}</span>
                  <span
                    aria-hidden="true"
                    className={`h-px w-7 bg-signal transition-opacity duration-[240ms] ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right: diagram */}
        <div className="flex justify-center">
          <StackDiagram
            ref={svg}
            layers={STACK_LAYERS}
            active={active}
            geometry={FULL_GEOMETRY}
            onHover={setHovered}
            dimInactive={sequence}
            className="hidden h-auto max-h-[calc(100svh-210px)] w-full md:block"
          />
          <StackDiagram
            layers={STACK_LAYERS}
            active={0}
            geometry={MINI_GEOMETRY}
            className="h-auto w-full max-w-[350px] md:hidden"
          />
        </div>
      </div>

      {/* Desktop footer row */}
      <div className="mt-6 hidden items-center justify-between font-mono text-[12px] text-ink-tertiary md:flex">
        <span aria-hidden="true">
          Layer <RollingNumber value={STACK_LAYERS[active].number} /> of {total}
        </span>
        {sequence && (
          <span aria-hidden="true" className="flex items-center gap-4">
            Scroll to assemble
            <span className="relative h-px w-[120px] overflow-hidden bg-white/10">
              <span ref={progress} className="absolute inset-0 origin-left scale-x-0 bg-ink-primary" />
            </span>
          </span>
        )}
      </div>

      {/* Mobile: layer cards */}
      <ul className="mt-8 flex flex-col gap-3 md:hidden">
        {STACK_LAYERS.map((layer, i) => (
          <li
            key={layer.number}
            data-reveal="fade"
            className={`flex flex-col gap-3 rounded-2xl border bg-surface-card p-5 ${
              i === 0 ? 'border-[rgb(156_201_255/0.35)]' : 'border-white/[0.08]'
            }`}
          >
            <h3 className="flex items-baseline gap-3 text-[18px] font-medium text-ink-primary">
              <span className="font-mono text-[12px] text-ink-tertiary">{layer.number}</span>
              {layer.name}
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label={`${layer.name} tools`}>
              {layer.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-white/10 px-2.5 py-1.5 font-mono text-[12px] leading-none text-ink-body"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Screen readers, desktop: the full tool list (the diagram is decorative;
          mobile already lists the tools in the cards) */}
      <div className="sr-only hidden md:block">
        {STACK_LAYERS.map((layer) => (
          <p key={layer.number}>
            {layer.name}: {layer.tools.join(', ')}
          </p>
        ))}
      </div>
    </section>
  );
};

export default Stack;
