/** About section copy (spec §17) — exact text, do not paraphrase. */

export const ABOUT = {
  eyebrow: 'About',
  statement: {
    lead: "I'm Rahat, a full-stack developer from Jashore, Bangladesh.",
    trail: 'I build business platforms end to end, from the database and APIs to the interface people use every day.',
  },
  body: {
    full: "I care about two things: interfaces that feel clear and reliable, and code the next person can read and extend. That's what keeps a product healthy long after launch.",
    /** Mobile shows the first sentence only (§17 mobile). */
    firstSentence: 'I care about two things: interfaces that feel clear and reliable, and code the next person can read and extend.',
  },
  portraitCaption: { left: 'Rahat Chowdhury', right: 'Jashore, BD' },
  facts: [
    { label: 'Experience', value: '5+ years · frontend lead → full-stack' },
    { label: 'Currently', value: 'Full-Stack Developer, Codevioso' },
    { label: 'Focus', value: 'SaaS, dashboards, business platforms' },
    { label: 'Availability', value: 'Product work & freelance', available: true },
  ],
  principlesLabel: 'How I work',
  principles: [
    {
      number: '01',
      title: 'The whole system, not one layer',
      text: "Schema, API and interface designed together, so features don't fight each other later.",
    },
    {
      number: '02',
      title: 'Clear for the people using it',
      text: 'Reliable, readable interfaces for the teams who live in these tools every day.',
    },
    {
      number: '03',
      title: 'Built to be maintained',
      text: 'Readable code and steady collaboration, so the product stays healthy after launch.',
    },
  ],
} as const;
