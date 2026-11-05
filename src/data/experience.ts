/**
 * Experience roles (spec §20), newest first. Only confirmed facts; years the
 * spec marks [ ] are unconfirmed and flagged with `periodConfirmed: false`.
 * No metrics unless the owner confirms them.
 */

export type Lane = 'codevioso' | 'redishketch';

export interface Role {
  id: string;
  period: string;
  /** False while the owner still has to confirm the years. */
  periodConfirmed: boolean;
  title: string;
  company: string;
  companyUrl?: string;
  /** Extra line after the company, e.g. location or promotion note. */
  detail?: string;
  description: string;
  /** Only real, provable highlights; empty until the owner supplies them. */
  highlights: readonly string[];
  lane: Lane;
  current: boolean;
}

export const ROLES: readonly Role[] = [
  {
    id: 'codevioso-fullstack',
    period: '2025 — Present',
    periodConfirmed: true,
    title: 'Full-Stack Developer',
    company: 'Codevioso',
    companyUrl: 'https://codevioso.com',
    detail: 'Jashore',
    description:
      'Building custom web apps, SaaS products and business software end to end, from database design to the shipped interface.',
    highlights: [],
    lane: 'codevioso',
    current: true,
  },
  {
    id: 'redishketch-lead',
    // TODO confirm: years marked [ ] in spec §20
    period: '2022 — 2024',
    periodConfirmed: false,
    title: 'Frontend Lead',
    company: 'Redishketch',
    detail: 'Promoted from Frontend Developer',
    description:
      'Led frontend work on client projects and business platforms, working with design and product teams.',
    highlights: [],
    lane: 'redishketch',
    current: false,
  },
  {
    id: 'redishketch-frontend',
    // TODO confirm: years marked [ ] in spec §20
    period: '2021 — 2022',
    periodConfirmed: false,
    title: 'Frontend Developer',
    company: 'Redishketch',
    description: 'Built responsive websites and interfaces for clients, working closely with designers.',
    highlights: [],
    lane: 'redishketch',
    current: false,
  },
];
