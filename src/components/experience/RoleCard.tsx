import type { Role } from '../../data/experience';

/**
 * Role card (spec §20): date (mono 12), title 26, company line 15 (company
 * as an underlined link where public), description, optional highlights.
 * The current role has an ember border and a `HEAD → current` pill.
 */
const RoleCard = ({ role }: { role: Role }) => (
  <article
    data-role-card
    data-spotlight
    className={`flex flex-col gap-3 rounded-[14px] border bg-surface-card p-[18px] md:min-h-[220px] md:gap-4 md:rounded-[18px] md:px-8 md:py-7 ${
      role.current ? 'border-[rgb(242_178_122/0.3)]' : 'border-white/[0.08]'
    }`}
  >
    <div data-role-date className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-tertiary">
      <span>{role.period}</span>
      {role.current && (
        <span className="rounded-full border border-[rgb(242_178_122/0.4)] px-2.5 py-1 text-[11px] normal-case tracking-normal text-ember">
          HEAD → current
        </span>
      )}
    </div>
    <h3 className="text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-ink-primary md:text-[26px]">{role.title}</h3>
    <p className="text-[15px] text-ink-secondary">
      {role.companyUrl ? (
        <a
          href={role.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw text-ink-body transition-colors hover:text-ink-primary"
        >
          {role.company}
        </a>
      ) : (
        <span className="text-ink-body">{role.company}</span>
      )}
      {role.detail && <span> · {role.detail}</span>}
    </p>
    <p className="max-w-[640px] text-[14px] leading-[1.6] text-ink-secondary md:text-[15px]">{role.description}</p>
    {role.highlights.length > 0 && (
      // Highlights read like commit messages (POLISH P2-18); real content only
      <ul aria-label="Highlights" className="mt-1 flex flex-col gap-1.5 font-mono text-[13px] leading-[1.5] text-ink-secondary">
        {role.highlights.map((h) => (
          <li key={h} className="flex gap-2.5">
            <span aria-hidden="true" className="text-signal">→</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    )}
  </article>
);

export default RoleCard;
