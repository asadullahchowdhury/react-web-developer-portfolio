/**
 * Work section projects (spec §15, §3.5). The number of entries drives the
 * Work pin length and the counter (§11.2). Never invent project facts:
 * unknowns stay [PLACEHOLDER].
 */

export interface Project {
  id: string;
  title: string;
  /** Category line after the number, e.g. "SaaS · Facilities management". */
  category: string;
  description: string;
  /** Mono path label in the image top bar, e.g. "cafm / dashboard". */
  pathLabel: string;
  image: string | null;
  imageAlt: string;
  tags: readonly string[];
  /** Public link, or null when there is none. */
  link: { href: string; label: string } | null;
}

export const PLACEHOLDER = '[PLACEHOLDER]';

export const PROJECTS: readonly Project[] = [
  {
    id: 'cafm',
    title: 'CAFM Platform',
    category: 'SaaS · Facilities management',
    description:
      'Computer-aided facilities management: assets, work orders and maintenance in one system.',
    pathLabel: 'cafm / dashboard',
    image: '/assets/images/cafm-platform.png',
    imageAlt: 'CAFM Platform dashboard',
    tags: ['Laravel', 'Vue.js', 'Angular', 'Full-stack'],
    // [PLACEHOLDER] case study or none — no public client URL (spec §15)
    link: null,
  },
  {
    id: 'barberly',
    title: 'Barberly',
    category: 'SaaS · Booking & management',
    description: 'Cloud software that helps barbershops and salons run bookings, staff and payments.',
    pathLabel: 'barberly / bookings',
    image: '/assets/images/barberly.png',
    imageAlt: 'Barberly booking dashboard',
    tags: ['Vue.js', 'Node.js', 'Laravel', 'Stripe'],
    link: { href: 'https://barberly.thethemeai.com', label: 'Open Barberly' },
  },
  {
    id: 'project-03',
    title: PLACEHOLDER,
    category: PLACEHOLDER,
    description: PLACEHOLDER,
    pathLabel: PLACEHOLDER,
    image: null,
    imageAlt: '',
    tags: [],
    link: null,
  },
];
