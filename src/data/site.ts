/** Site-wide facts and links. Single source for header, sections and footer. */

export const SITE = {
  name: 'Rahat Chowdhury',
  role: 'Full-Stack Developer',
  email: 'crahat4@gmail.com',
  location: 'Jashore, Bangladesh',
  locationShort: 'Jashore, BD',
  timezone: 'GMT+6',
  status: 'Open to product work & freelance',
  resume: '/assets/resume.pdf',
  github: 'https://github.com/asadullahchowdhury',
  linkedin: 'https://www.linkedin.com/in/chowdhuryrahat',
} as const;

export interface SocialLink {
  label: string;
  href: string;
  /** Short mono hint shown on link rows (Contact). */
  hint: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'GitHub', href: SITE.github, hint: 'github.com/asadullahchowdhury' },
  { label: 'LinkedIn', href: SITE.linkedin, hint: 'in/chowdhuryrahat' },
  { label: 'Résumé', href: SITE.resume, hint: 'PDF' },
];

/**
 * Chapter numbers (spec §2.3): 01 Hero · 02 Work · 03 About + Stack +
 * Experience · 04 Contact. Used by every section's HUD line.
 */
export const CHAPTERS = {
  hero: 1,
  projects: 2,
  about: 3,
  skills: 3,
  experience: 3,
  contact: 4,
} as const;

export const CHAPTER_TOTAL = 4;

export type ChapterSection = keyof typeof CHAPTERS;

/** "03 / 04" */
export const chapterLabel = (section: ChapterSection) =>
  `${String(CHAPTERS[section]).padStart(2, '0')} / ${String(CHAPTER_TOTAL).padStart(2, '0')}`;
