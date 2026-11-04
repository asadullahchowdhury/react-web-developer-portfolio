import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { scrollToId } from '../lib/scroll';
import Logo from './brand/Logo';
import DesktopHeader from './header/DesktopHeader';
import MobileMenu from './header/MobileMenu';
import { NAV_ITEMS, SECTION_IDS } from './header/navItems';
import { useActiveSection } from './header/useActiveSection';
import { useHeaderScroll } from './header/useHeaderScroll';
import { useInert } from './header/useInert';
import { useLocalTime } from './header/useLocalTime';

/**
 * Site header: desktop states 1 / 2 (≥ 768 px), mobile floating bar and
 * full-screen menu (< 768 px).
 *
 * The root stays a <header> (the hero intro fades it in) and ignores the
 * pointer except on its bars, so it never blocks the page underneath.
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { compact, hidden } = useHeaderScroll(menuOpen);
  const active = useActiveSection(SECTION_IDS);
  const time = useLocalTime();
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileBar = useRef<HTMLDivElement>(null);
  const pendingTarget = useRef<string | null>(null);
  useInert(mobileBar, menuOpen);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Links: scroll to the section; sections that don't exist yet are a no-op.
  // From the menu, scroll after it has closed and unlocked page scrolling.
  const onNavigate = useCallback(
    (target: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (menuOpen) {
        pendingTarget.current = target;
        setMenuOpen(false);
      } else {
        scrollToId(target);
      }
    },
    [menuOpen],
  );

  useEffect(() => {
    if (menuOpen || !pendingTarget.current) return;
    scrollToId(pendingTarget.current);
    pendingTarget.current = null;
  }, [menuOpen]);

  // The menu is mobile-only: close it if the window grows past 768 px
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const onChange = () => desktop.matches && setMenuOpen(false);
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  const current = NAV_ITEMS.find((i) => i.target === active) ?? NAV_ITEMS[0];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <DesktopHeader compact={compact} hidden={hidden} active={active} time={time} onNavigate={onNavigate} />

      {/* Mobile floating bar */}
      <div
        ref={mobileBar}
        className={`pointer-events-auto absolute inset-x-3 top-2.5 transition-[opacity,transform] duration-300 ease-lab motion-reduce:transition-none md:hidden ${
          hidden ? '-translate-y-[140%] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 rounded-full border border-subtle bg-void/70 pl-4 pr-1.5 backdrop-blur-xl">
          <a href="#hero" onClick={onNavigate('hero')} aria-label="Rahat Chowdhury — home" className="rounded-md">
            <Logo variant="short" size={22} animate />
          </a>
          <span aria-hidden="true" className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">
            {current.number} · {current.label}
          </span>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="inline-flex h-11 items-center rounded-full border border-strong px-5 text-[14px] font-medium text-ink-primary"
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <MobileMenu
          active={active}
          time={time}
          onClose={closeMenu}
          onNavigate={onNavigate}
          returnFocus={menuButton}
        />
      )}
    </header>
  );
};

export default Header;
