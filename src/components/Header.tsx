import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/** Nav per hero-redesign-spec §2.2. Scroll targets become pin-aware in the scroll step. */
const NAV_ITEMS = [
  { label: 'Work', target: 'projects' },
  { label: 'Stack', target: 'skills' },
  { label: 'Experience', target: 'experience' },
  { label: 'Contact', target: 'contact' },
] as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 12;
      setIsScrolled(prev => (prev !== next ? next : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const element = document.getElementById(sectionId);
    setIsMenuOpen(false);
    if (!element) return;
    e.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(window, {
      duration: reduceMotion ? 0 : 1.2,
      scrollTo: element,
      ease: 'power2.inOut',
    });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-subtle bg-void/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8 md:py-7 lg:px-12 xl:px-16"
      >
        {/* Logo: RC mark + name */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, 'hero')}
          className="flex items-center gap-3 rounded-lg"
          aria-label="Rahat Chowdhury — back to top"
        >
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-strong font-mono text-xs font-medium text-ink-primary md:h-8 md:w-8"
          >
            RC
          </span>
          <span className="text-[15px] font-medium tracking-tight text-ink-primary">
            Rahat Chowdhury
          </span>
        </a>

        {/* Desktop / tablet navigation */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ label, target }) => (
            <li key={target}>
              <a
                href={`#${target}`}
                onClick={(e) => scrollToSection(e, target)}
                className="inline-flex min-h-11 items-center rounded-lg px-3.5 py-3 text-nav text-ink-secondary transition-colors duration-200 hover:text-ink-primary"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-strong text-ink-primary transition-colors hover:border-ink-tertiary md:hidden"
          onClick={() => setIsMenuOpen(open => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
        </button>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-[76px] z-40 cursor-default bg-void/70 md:hidden"
            />
            <div
              id="mobile-nav"
              className="absolute inset-x-5 top-full z-50 mt-2 rounded-xl border border-subtle bg-surface-card p-2 shadow-soft md:hidden"
            >
              <ul className="flex flex-col">
                {NAV_ITEMS.map(({ label, target }) => (
                  <li key={target}>
                    <a
                      href={`#${target}`}
                      onClick={(e) => scrollToSection(e, target)}
                      className="flex min-h-11 items-center rounded-lg px-4 text-body text-ink-secondary transition-colors hover:bg-glass hover:text-ink-primary"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
