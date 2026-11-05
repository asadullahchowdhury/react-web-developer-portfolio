import { useCallback, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CONTACT } from '../../data/contact';
import { chapterLabel, SITE, SOCIAL_LINKS } from '../../data/site';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useReveal } from '../../hooks/useReveal';
import { EASE_LAB, gsap } from '../../lib/motion';
import ContactForm from './ContactForm';

/**
 * Contact (spec §21): the closing chapter. The hero's platform rings return
 * faintly behind the bottom of the section, and sending the form transmits a
 * glowing packet from the button into the platform, which pulses once.
 * Reduced motion: no packet, the success state shows directly.
 */
const Contact = () => {
  const section = useRef<HTMLElement>(null);
  const overlay = useRef<SVGSVGElement>(null);
  const inner = useRef<SVGEllipseElement>(null);
  const reduced = useReducedMotion();
  useReveal(section);

  const onTransmit = useCallback(
    async (from: HTMLElement) => {
      const root = section.current;
      const svg = overlay.current;
      const ring = inner.current;
      if (reduced || !root || !svg || !ring) return;

      const box = root.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = ring.getBoundingClientRect();
      const x1 = a.left + a.width / 2 - box.left;
      const y1 = a.top + a.height / 2 - box.top;
      const x2 = b.left + b.width / 2 - box.left;
      const y2 = b.top + b.height / 2 - box.top;

      const line = svg.querySelector('line');
      const packet = svg.querySelector('circle');
      if (!line || !packet) return;
      line.setAttribute('x1', String(x1));
      line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2));
      line.setAttribute('y2', String(y2));

      await new Promise<void>((resolve) => {
        gsap
          .timeline({ onComplete: resolve })
          .set(svg, { opacity: 1 })
          .fromTo(line, { strokeDasharray: 100, strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.35, ease: EASE_LAB })
          .fromTo(packet, { attr: { cx: x1, cy: y1 }, opacity: 1 }, { attr: { cx: x2, cy: y2 }, duration: 0.9, ease: 'power1.in' }, 0)
          .to(packet, { opacity: 0, duration: 0.15 })
          .to(ring, { attr: { 'stroke-opacity': 0.9, 'fill-opacity': 0.12 }, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
          .to(svg, { opacity: 0, duration: 0.3 });
      });
    },
    [reduced],
  );

  return (
    <section
      ref={section}
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-void px-5 pb-14 pt-10 md:px-12 md:pb-32 md:pt-8 xl:px-16"
    >
      {/* Platform bookend: the hero's rings, faint, behind the bottom of the section */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1100 280"
        className="pointer-events-none absolute bottom-0 left-1/2 w-[1100px] max-w-none -translate-x-1/2"
      >
        <ellipse cx="550" cy="280" rx="540" ry="140" fill="none" stroke="rgb(255 255 255 / 0.05)" />
        <ellipse
          ref={inner}
          cx="550"
          cy="280"
          rx="260"
          ry="66"
          fill="#9CC9FF"
          fillOpacity="0.03"
          stroke="#9CC9FF"
          strokeOpacity="0.18"
        />
      </svg>

      {/* Transmission overlay (line + packet), shown only while sending */}
      <svg ref={overlay} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-0">
        <line stroke="rgb(156 201 255 / 0.5)" strokeWidth="1" pathLength={100} />
        <circle r="5" fill="#EDF4FF" opacity="0" style={{ filter: 'drop-shadow(0 0 8px rgb(156 201 255 / 0.9))' }} />
      </svg>

      <div className="relative mx-auto flex max-w-[1312px] flex-col gap-8 md:gap-14">
        <p data-reveal="fade" className="font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-tertiary md:text-hud">
          {chapterLabel('contact')} — {CONTACT.hud}
        </p>

        <h2
          id="contact-title"
          data-reveal="lines"
          className="text-[52px] font-medium leading-[0.95] tracking-[-0.055em] text-ink-primary md:text-[80px] lg:text-[104px]"
        >
          {CONTACT.title.lead} <span className="text-ink-tertiary">{CONTACT.title.trail}</span>
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-20">
          {/* Left: lead, email, links, status */}
          <div className="flex flex-col gap-8 md:gap-9">
            <p data-reveal="fade" className="max-w-[480px] text-[16px] leading-[1.6] text-ink-secondary md:text-lead">
              {CONTACT.lead}
            </p>
            <a
              data-reveal="fade"
              href={`mailto:${SITE.email}`}
              className="link-draw w-fit text-[22px] font-medium tracking-[-0.02em] text-ink-primary md:text-[30px]"
            >
              {SITE.email}
            </a>

            <ul data-reveal="fade" className="hidden flex-col md:flex">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-14 items-center justify-between border-t border-white/[0.08] text-[16px] text-ink-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="link-draw link-draw-bare">{link.label}</span>
                      <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" className="text-ink-tertiary transition-colors group-hover:text-ink-primary" />
                    </span>
                    <span className="font-mono text-[12px] text-ink-tertiary">{link.hint}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div data-reveal="fade" className="hidden flex-col gap-2 font-mono text-[12px] text-ink-tertiary md:flex">
              <span className="inline-flex items-center gap-2 text-ink-body">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ember" />
                {SITE.status}
              </span>
              <span>
                {SITE.location} · {SITE.timezone}
              </span>
            </div>
          </div>

          {/* Right: form */}
          <div data-reveal="fade">
            <ContactForm onTransmit={onTransmit} />
          </div>

          {/* Mobile: link rows + status after the form */}
          <div className="flex flex-col gap-6 md:hidden">
            <ul className="flex flex-col">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 items-center justify-between border-t border-white/[0.08] text-[16px] text-ink-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      {link.label}
                      <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" className="text-ink-tertiary" />
                    </span>
                    <span className="font-mono text-[12px] text-ink-tertiary">{link.hint}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 font-mono text-[12px] text-ink-tertiary">
              <span className="inline-flex items-center gap-2 text-ink-body">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ember" />
                {SITE.status}
              </span>
              <span>
                {SITE.location} · {SITE.timezone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
