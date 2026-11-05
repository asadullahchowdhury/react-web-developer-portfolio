import type { MouseEvent } from 'react';
import { SITE } from '../../data/site';
import { scrollToId, scrollToPosition } from '../../lib/scroll';

const FOOTER_NAV = [
  { label: 'Work', target: 'projects' },
  { label: 'About', target: 'about' },
  { label: 'Experience', target: 'experience' },
] as const;

const linkClass =
  'inline-flex min-h-11 items-center text-[14px] text-ink-secondary transition-colors hover:text-ink-primary';

/**
 * Footer (spec §21): © row + footer nav, then a giant decorative wordmark
 * cropped by the bottom of the page (aria-hidden).
 */
const Footer = () => {
  const year = new Date().getFullYear();

  const go = (target: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(target);
  };
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToPosition(0);
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-void">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 md:px-12 xl:px-16">
        <p className="font-mono text-[12px] text-ink-tertiary">
          © {year} {SITE.name}
          <span className="hidden md:inline"> · Full-stack developer</span>
        </p>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-6">
            {FOOTER_NAV.map((item) => (
              <li key={item.target} className="hidden md:block">
                <a href={`#${item.target}`} onClick={go(item.target)} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#hero" onClick={toTop} className={linkClass}>
                Back to top ↑
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden px-5 md:px-12 xl:px-16">
        {/* Drawn as generated content: it is decorative and intentionally
            low-contrast (#10151D, spec §21), so it stays out of the text tree */}
        <p
          data-mobile="Rahat"
          data-desktop={SITE.name}
          className="-mb-[0.22em] whitespace-nowrap text-[76px] font-medium leading-none tracking-[-0.06em] text-[#10151D] before:content-[attr(data-mobile)] md:text-[clamp(96px,11.7vw,168px)] md:before:content-[attr(data-desktop)]"
        />
      </div>
    </footer>
  );
};

export default Footer;
