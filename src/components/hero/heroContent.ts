/**
 * Hero copy — exact text from hero-redesign-spec §2.2 / §3.4.
 * Anything the spec does not supply is left as [PLACEHOLDER].
 */

export const heroCopy = {
  label: 'Full-stack developer',
  headline: {
    lead: 'I build business platforms,',
    trail: 'from the interface to the system behind it.',
  },
  lead: {
    full: '5+ years building full-stack SaaS end to end: dashboards, booking and facilities management, with clear UX and code that stays maintainable after launch.',
    short: '5+ years building full-stack SaaS end to end.',
  },
  primaryCta: { label: 'Enter the lab', target: 'projects' },
  secondaryCta: { label: 'Download résumé', href: '/assets/resume.pdf' },
  proof: {
    prefix: 'Recently shipped —',
    projects: ['CAFM platform', 'Barberly'],
  },
  /** Visually hidden description of the decorative 3D stage (spec §13). */
  sceneDescription: '[PLACEHOLDER]',
} as const;

export const heroHud = {
  desktop: {
    chapter: '01 / 04',
    status: 'Jashore, BD · Open to product work & freelance',
  },
  mobile: {
    chapter: '01 / Entrance',
    status: 'Jashore, BD · Open to work',
  },
  scroll: 'Scroll',
} as const;

export type PanelRowTone = 'body' | 'signal' | 'ember';

export interface PanelRow {
  key: string;
  value: string;
  /** Colour of the key / value, matched to artboard 01. */
  keyTone: PanelRowTone;
  valueTone: PanelRowTone;
}

export interface PanelContent {
  title: string;
  layout: 'split' | 'inline';
  rows: PanelRow[];
}

export const deployPanel: PanelContent = {
  title: 'deploy / main',
  layout: 'split',
  rows: [
    { key: 'test', value: 'passed', keyTone: 'body', valueTone: 'signal' },
    { key: 'build', value: 'passed', keyTone: 'body', valueTone: 'signal' },
    { key: 'release', value: 'live', keyTone: 'body', valueTone: 'ember' },
  ],
};

export const schemaPanel: PanelContent = {
  title: 'work_orders',
  layout: 'inline',
  rows: [
    { key: 'id', value: 'uuid', keyTone: 'signal', valueTone: 'body' },
    { key: 'asset_id', value: '→ assets', keyTone: 'signal', valueTone: 'body' },
    { key: 'status', value: 'enum', keyTone: 'signal', valueTone: 'body' },
  ],
};
