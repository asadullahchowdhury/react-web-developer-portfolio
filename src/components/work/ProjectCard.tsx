import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * Work card (spec §3.5 and "Card states"). 600 px wide on desktop, full
 * width below 768 px. Cards without a public link are still focusable so
 * keyboard users can bring them into view (focus scrolls the track).
 *
 * Hover (fine pointer): lifts 4 px, border 16%, background #0E131B, image
 * scales to 1.03, arrow button fills. 240 ms ease-lab. Off with reduced motion.
 */
const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const number = String(index + 1).padStart(2, '0');
  const titleId = `project-${project.id}-title`;

  return (
    <article
      data-work-card
      aria-labelledby={titleId}
      tabIndex={project.link ? undefined : 0}
      className="group flex w-full shrink-0 flex-col gap-5 rounded-[18px] border border-white/[0.08] bg-surface-card p-3 pb-5 outline-none transition-[transform,border-color,background-color] duration-[240ms] ease-lab focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-signal has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-[3px] has-[a:focus-visible]:outline-signal motion-reduce:transition-none md:w-[600px] md:gap-6 md:rounded-[20px] md:p-4 md:pb-6 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-white/[0.16] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#0E131B] motion-reduce:hover:translate-y-0"
    >
      {/* Image with a mono path bar */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-graphite">
        <div className="flex h-[34px] items-center gap-2 border-b border-white/[0.06] px-3.5 font-mono text-[11px] text-ink-tertiary">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          </span>
          <span className="truncate">{project.pathLabel}</span>
        </div>
        <div className="relative h-[220px] overflow-hidden md:h-[min(360px,38vh)]">
          {project.image ? (
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              decoding="async"
              width={1600}
              height={1000}
              className="h-full w-full object-cover object-top transition-transform duration-[240ms] ease-lab motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[12px] tracking-[0.08em] text-ink-tertiary">
              [PLACEHOLDER]
            </div>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-3 px-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
          {number} · {project.category}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h3 id={titleId} className="text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-ink-primary md:text-[26px]">
            {project.title}
          </h3>
          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.link.label} (opens in a new tab)`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-strong text-ink-primary transition-colors duration-[240ms] ease-lab [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-ink-primary [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-ink-primary [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-void"
            >
              <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
        </div>
        <p className="max-w-[420px] text-[14px] leading-[1.55] text-ink-secondary md:text-[15px]">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2" aria-label="Stack">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/[0.08] px-2.5 py-1.5 font-mono text-[11px] leading-none text-ink-body md:text-[12px]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
