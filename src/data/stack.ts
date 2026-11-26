/**
 * Stack as four layers of one product (spec §19), from Rahat's GitHub README.
 * No skill levels or percentages.
 */

export interface StackLayer {
  number: string;
  name: string;
  tools: readonly string[];
}

export const STACK_LAYERS: readonly StackLayer[] = [
  {
    number: '01',
    name: 'Interface',
    tools: ['Angular', 'React', 'Vue.js', 'Next.js', 'Nuxt.js', 'Flutter', 'TypeScript', 'Dart', 'Tailwind', 'SCSS', 'GSAP'],
  },
  { number: '02', name: 'Application', tools: ['PHP', 'Laravel', 'Node.js'] },
  { number: '03', name: 'Data', tools: ['MySQL', 'MongoDB', 'SQLite'] },
  { number: '04', name: 'Workflow', tools: ['Git', 'Docker', 'Linear', 'Figma', 'Claude Code', 'ChatGPT', 'Gemini'] },
];
