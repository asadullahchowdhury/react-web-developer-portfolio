/** Site navigation — one list for the desktop header and the mobile menu. */
import { SITE } from '../../data/site';

export interface NavItem {
  number: string;
  label: string;
  /** Section element id (spec §18 order). */
  target: string;
  /** Shown in the desktop header (01–04); Home and Contact live elsewhere there. */
  desktop: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { number: '00', label: 'Home', target: 'hero', desktop: false },
  { number: '01', label: 'Work', target: 'projects', desktop: true },
  { number: '02', label: 'About', target: 'about', desktop: true },
  { number: '03', label: 'Stack', target: 'skills', desktop: true },
  { number: '04', label: 'Experience', target: 'experience', desktop: true },
  { number: '05', label: 'Contact', target: 'contact', desktop: false },
];

export const SECTION_IDS = NAV_ITEMS.map((i) => i.target);

export const CONTACT_TARGET = 'contact';

export { SOCIAL_LINKS } from '../../data/site';

/** Same wording as the hero HUD (spec §2.2). */
export const STATUS_TEXT = SITE.status;
