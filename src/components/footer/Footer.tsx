import { type MouseEvent, useEffect, useRef } from 'react';
import { SITE } from '../../data/site';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_LAB, gsap } from '../../lib/motion';
import { loadScrollLibs, scrollToId, scrollToPosition } from '../../lib/scroll';
import { replaySceneIntro } from '../hero/scene/replayIntro';

const FOOTER_NAV = [
  { label: 'Work', target: 'projects' },
  { label: 'About', target: 'about' },
  { label: 'Experience', target: 'experience' },
] as const;

const linkClass =
  'inline-flex min-h-11 items-center text-[14px] text-ink-secondary transition-colors hover:text-ink-primary';

/**
 * Decorative wordmark letters. Each letter is CSS generated content (no text
 * node): the wordmark is intentionally low-contrast (#10151D, spec §21) and
 * stays out of the text/accessibility tree. Letters share a viewport-fixed
 * radial gradient, so the ones near the pointer brighten (P2-15).
 */
const WordmarkLetters = ({ text }: { text: string }) =>
  [...text].map((ch, i) => (
    <span
      key={i}
      data-wordmark-letter
      data-ch={ch === ' ' ? ' ' : ch}
      className="wordmark-letter inline-block before:content-[attr(data-ch)]"
    />
  ));

/**
 * Footer (spec §21): © row + footer nav, then a giant decorative wordmark
 * cropped by the bottom of the page (aria-hidden). Its letters rise into
 * place with a 30 ms stagger when the footer enters view.
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const wordmark = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = wordmark.current;
    if (!root || reduced) return;
    let cancelled = false;
    let teardown = () => {};
    loadScrollLibs().then(() => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        root.querySelectorAll('[data-wordmark-line]').forEach((line) => {
          gsap.from(line.querySelectorAll('[data-wordmark-letter]'), {
            yPercent: 110,
            duration: 0.8,
            stagger: 0.03,
            ease: EASE_LAB,
            scrollTrigger: { trigger: root, start: 'top bottom', once: true },
          });
        });
      }, root);
      teardown = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      teardown();
    };
  }, [reduced]);

  const go = (target: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(target);
  };
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Lenis, 1.2 s on the shared ease-lab curve, then a short intro replay
    scrollToPosition(0, { duration: 1.2, ease: 'lab', onComplete: replaySceneIntro });
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

      <div
        ref={wordmark}
        aria-hidden="true"
        data-pointer-glow
        className="pointer-events-none select-none overflow-hidden px-5 md:px-12 xl:px-16"
      >
        <p
          data-wordmark-line
          className="-mb-[0.22em] whitespace-nowrap text-[76px] font-medium leading-none tracking-[-0.06em] md:hidden"
        >
          <WordmarkLetters text="Rahat" />
        </p>
        <p
          data-wordmark-line
          className="-mb-[0.22em] hidden whitespace-nowrap text-[clamp(96px,11.7vw,168px)] font-medium leading-none tracking-[-0.06em] md:block"
        >
          <WordmarkLetters text={SITE.name} />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
