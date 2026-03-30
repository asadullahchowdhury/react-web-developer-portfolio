/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        foreground: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        accent: 'var(--accent)',
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
      },
      ringColor: {
        accent: 'var(--accent)',
      },
      ringOffsetColor: {
        'background-primary': 'var(--bg-primary)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      /* Minimal, near-flat surfaces; use solid accent in components where possible */
      backgroundImage: {
        'gradient-surface':
          'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 48%, var(--bg-primary) 100%)',
        'gradient-accent-br':
          'linear-gradient(to bottom right, color-mix(in srgb, var(--accent) 85%, var(--bg-secondary)), color-mix(in srgb, var(--accent) 45%, var(--bg-secondary)))',
        'gradient-accent-h':
          'linear-gradient(to right, color-mix(in srgb, var(--accent) 90%, var(--bg-primary)), color-mix(in srgb, var(--accent) 65%, var(--bg-primary)))',
        'gradient-accent-h-rev':
          'linear-gradient(to right, color-mix(in srgb, var(--accent) 65%, var(--bg-primary)), color-mix(in srgb, var(--accent) 90%, var(--bg-primary)))',
        'gradient-line-h':
          'linear-gradient(to right, transparent, var(--border-subtle), transparent)',
        'gradient-line-v':
          'linear-gradient(to bottom, transparent, var(--border-subtle), transparent)',
      },
    },
  },
  plugins: [],
};
