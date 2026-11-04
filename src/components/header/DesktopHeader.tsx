import { type MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Logo from '../brand/Logo';
import { CONTACT_TARGET, NAV_ITEMS } from './navItems';
import { useInert } from './useInert';

const DESKTOP_ITEMS = NAV_ITEMS.filter((i) => i.desktop);

interface DesktopHeaderProps {
  compact: boolean;
  hidden: boolean;
  active: string;
  time: string;
  onNavigate: (target: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
}

const transition = 'transition-[opacity,transform] duration-300 ease-lab motion-reduce:transition-none';

/** Ember "available" dot used beside "Let's talk". */
const EmberDot = () => (
  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgb(var(--ember-rgb)/0.7)]" />
);

/** Scroll progress through the whole page, drawn on the bar's bottom edge. */
const ScrollProgress = () => {
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 bottom-0 h-px overflow-hidden bg-white/10">
      <span ref={fill} className="block h-full w-full origin-left scale-x-0 bg-signal" />
    </span>
  );
};

/**
 * Desktop header (≥ 768 px).
 * State 1 (top): transparent, full width — full logo, numbered nav, local
 * time, outlined "Let's talk". State 2 (after 80 px): floating 760 px glass
 * bar — short logo, sliding active pill with a glowing dot, filled
 * "Let's talk", scroll-progress line. State 2 hides on scroll down.
 */
const DesktopHeader = ({ compact, hidden, active, time, onNavigate }: DesktopHeaderProps) => {
  const topRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const showBar = compact && !hidden;
  useInert(topRef, compact);
  useInert(barRef, !showBar);

  // Sliding pill: follows the active link in the floating bar
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);
  useLayoutEffect(() => {
    // Measured against the list (links sit in positioned <li>s, so offsetLeft
    // would be relative to each <li>)
    const measure = () => {
      const list = listRef.current;
      const el = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (!el || !list) return setPill(null);
      const a = el.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      setPill({ x: a.left - l.left, width: a.width });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <div className="hidden md:block">
      {/* State 1 — top of page */}
      <div
        ref={topRef}
        className={`pointer-events-auto absolute inset-x-0 top-0 ${transition} ${
          compact ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="mx-auto flex h-[100px] max-w-[1440px] items-center justify-between gap-6 md:px-8 lg:px-12 xl:px-16">
          <a href="#hero" onClick={onNavigate('hero')} aria-label="Rahat Chowdhury — home" className="rounded-md">
            <Logo variant="full" size={28} animate />
          </a>

          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              {DESKTOP_ITEMS.map((item) => {
                const current = item.target === active;
                return (
                  <li key={item.target}>
                    <a
                      href={`#${item.target}`}
                      onClick={onNavigate(item.target)}
                      aria-current={current ? 'location' : undefined}
                      className="group inline-flex min-h-11 items-baseline gap-1.5 rounded-md px-3 py-3"
                    >
                      <span className="font-mono text-[11px] text-ink-tertiary">{item.number}</span>
                      <span
                        className={`text-nav transition-colors ${
                          current ? 'text-ink-primary' : 'text-ink-secondary group-hover:text-ink-primary'
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden font-mono text-hud uppercase text-ink-tertiary lg:inline">
              JSR <time>{time}</time>
            </span>
            <a
              href={`#${CONTACT_TARGET}`}
              onClick={onNavigate(CONTACT_TARGET)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-strong px-5 text-[14px] font-medium text-ink-primary transition-colors hover:border-white/[0.28]"
            >
              <EmberDot />
              Let&apos;s talk
            </a>
          </div>
        </div>
      </div>

      {/* State 2 — floating glass bar */}
      <div
        ref={barRef}
        className={`pointer-events-auto absolute left-1/2 top-4 w-[760px] max-w-[calc(100vw-32px)] -translate-x-1/2 ${transition} ${
          showBar ? 'translate-y-0 opacity-100' : '-translate-y-[140%] opacity-0'
        }`}
      >
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-full border border-subtle bg-void/70 pl-4 pr-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.35)] backdrop-blur-xl">
          <a href="#hero" onClick={onNavigate('hero')} aria-label="Rahat Chowdhury — home" className="rounded-md">
            <Logo variant="short" size={24} />
          </a>

          <nav aria-label="Primary (compact)">
            <ul ref={listRef} className="relative flex items-center">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-0 rounded-full border border-subtle bg-white/[0.05] transition-[transform,width,opacity] duration-500 ease-lab motion-reduce:transition-none"
                style={{
                  width: pill?.width ?? 0,
                  transform: `translateX(${pill?.x ?? 0}px)`,
                  opacity: pill ? 1 : 0,
                }}
              >
                <span className="absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_10px_rgb(var(--signal-rgb)/0.9)]" />
              </span>
              {DESKTOP_ITEMS.map((item) => {
                const current = item.target === active;
                return (
                  <li key={item.target} className="relative">
                    <a
                      href={`#${item.target}`}
                      onClick={onNavigate(item.target)}
                      aria-current={current ? 'location' : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full py-2 pl-6 pr-3.5 text-nav transition-colors ${
                        current ? 'text-ink-primary' : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={`#${CONTACT_TARGET}`}
            onClick={onNavigate(CONTACT_TARGET)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-primary px-5 text-[14px] font-medium text-void transition-colors hover:bg-white"
          >
            <EmberDot />
            Let&apos;s talk
          </a>

          <ScrollProgress />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
