import type { PanelContent, PanelRowTone } from './heroContent';

const toneClass: Record<PanelRowTone, string> = {
  body: 'text-ink-body',
  signal: 'text-signal',
  ember: 'text-ember',
};

interface GlassPanelProps {
  content: PanelContent;
  className?: string;
}

/** Decorative DOM overlay on the 3D stage (spec §8 #11). Hidden from assistive tech. */
const GlassPanel = ({ content, className = '' }: GlassPanelProps) => (
  <div
    aria-hidden="true"
    data-intro="panel"
    className={`rounded-xl border border-subtle bg-glass px-4 py-3.5 font-mono text-panel backdrop-blur-[12px] ${className}`}
  >
    <p className="mb-2.5 text-ink-tertiary">{content.title}</p>
    <ul className="space-y-[7px]">
      {content.rows.map((row) => (
        <li
          key={row.key}
          className={content.layout === 'split' ? 'flex items-baseline justify-between gap-4' : ''}
        >
          <span className={toneClass[row.keyTone]}>{row.key}</span>
          {content.layout === 'inline' && ' '}
          <span className={toneClass[row.valueTone]}>{row.value}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default GlassPanel;
