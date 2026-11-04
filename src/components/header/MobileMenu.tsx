import { type MouseEvent, type RefObject, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { lockScroll, unlockScroll } from '../../lib/scroll';
import Logo from '../brand/Logo';
import { CONTACT_TARGET, NAV_ITEMS, SOCIAL_LINKS, STATUS_TEXT } from './navItems';
import { useFocusTrap } from './useFocusTrap';

interface MobileMenuProps {
  active: string;
  time: string;
  onClose: () => void;
  onNavigate: (target: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
  /** The Menu button, which gets focus back on close. */
  returnFocus: RefObject<HTMLButtonElement>;
}

/**
 * Full-screen mobile menu (< 768 px): 00 Home → 05 Contact at 38 px with an
 * active dot, "Let's talk", social links, status and local time.
 *
 * Modal dialog: focus is trapped inside, Escape closes, page scroll is
 * locked (Lenis paused) and focus returns to the Menu button.
 */
const MobileMenu = ({ active, time, onClose, onNavigate, returnFocus }: MobileMenuProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true, onClose, returnFocus);

  useEffect(() => {
    lockScroll();
    return unlockScroll;
  }, []);

  return (
    <div
      ref={dialogRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-lenis-prevent
      className="menu-enter pointer-events-auto fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-void px-5 pb-8 md:hidden"
    >
      {/* Top row mirrors the floating bar, so Close sits where Menu was */}
      <div className="flex h-[66px] shrink-0 items-center justify-between pl-4 pr-1.5 pt-2.5">
        <a href="#hero" onClick={onNavigate('hero')} aria-label="Rahat Chowdhury — home" className="rounded-md">
          <Logo variant="short" size={22} />
        </a>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center rounded-full border border-strong px-5 text-[14px] font-medium text-ink-primary"
        >
          Close
        </button>
      </div>

      <nav aria-label="Site" className="mt-8 flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => {
            const current = item.target === active;
            return (
              <li key={item.target} className="menu-item" style={{ ['--i' as string]: i }}>
                <a
                  href={`#${item.target}`}
                  onClick={onNavigate(item.target)}
                  aria-current={current ? 'location' : undefined}
                  className="flex min-h-[56px] items-center gap-4 rounded-lg py-1"
                >
                  <span className="w-6 font-mono text-[12px] text-ink-tertiary">{item.number}</span>
                  <span
                    className={`text-[38px] font-medium leading-[1.1] tracking-[-0.03em] ${
                      current ? 'text-ink-primary' : 'text-ink-secondary'
                    }`}
                  >
                    {item.label}
                  </span>
                  {current && (
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_rgb(var(--signal-rgb)/0.9)]"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="menu-item mt-10 flex flex-col gap-6" style={{ ['--i' as string]: NAV_ITEMS.length }}>
        <a
          href={`#${CONTACT_TARGET}`}
          onClick={onNavigate(CONTACT_TARGET)}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink-primary text-button text-void"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
          Let&apos;s talk
        </a>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-secondary"
              >
                {link.label}
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-subtle pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
            {STATUS_TEXT}
          </span>
          <span>
            JSR <time>{time}</time>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
