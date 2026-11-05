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
    image: '/assets/images/cafm-platform.webp',
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
    image: '/assets/images/barberly.webp',
    imageAlt: 'Barberly booking dashboard',
    tags: ['Vue.js', 'Node.js', 'Laravel', 'Stripe'],
    link: { href: 'https://barberly.thethemeai.com', label: 'Open Barberly' },
  },
  {
    id: 'hotel-blue-castle',
    title: 'Hotel Blue Castle',
    category: 'Hotel PMS · Website & operations',
    description:
      'Property management system for a single hotel: reservations, front desk, billing, housekeeping and the public booking site, in one app.',
    pathLabel: 'blue-castle / home',
    image: '/assets/images/hotel-blue-castle.webp',
    imageAlt: 'Hotel Blue Castle website home page',
    tags: ['Laravel', 'Vue.js', 'MySQL', 'Full-stack'],
    // Private repository and no public deployment yet
    link: null,
  },
];

/**
 * Projects with real data (title, description and image), in order. Only these
 * are rendered; the counter and the Work pin length follow this list, so
 * filling in project 03 above is all it takes to publish it.
 */
export const PUBLISHED_PROJECTS: readonly Project[] = PROJECTS.filter(
  (p) =>
    p.image !== null &&
    [p.title, p.description, p.category, p.pathLabel].every((v) => v.trim() !== '' && !v.includes(PLACEHOLDER)),
);
