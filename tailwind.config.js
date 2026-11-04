import defaultTheme from 'tailwindcss/defaultTheme';

/** Colour backed by an RGB-channel CSS variable, so `/opacity` modifiers work. */
const channel = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* "Graphite Lab" tokens (hero-redesign-spec §5) */
        void: channel('bg-void'),
        graphite: channel('bg-graphite'),
        'surface-card': channel('surface-card'),
        signal: {
          DEFAULT: channel('signal'),
          soft: channel('signal-soft'),
        },
        ember: channel('ember'),
        ink: {
          primary: channel('text-primary'),
          body: channel('text-body'),
          secondary: channel('text-secondary'),
          tertiary: channel('text-tertiary'),
        },

        /* Legacy names still used by existing sections */
        background: {
          primary: channel('bg-primary'),
          secondary: channel('bg-secondary'),
        },
        foreground: {
          primary: channel('text-primary'),
          secondary: channel('text-secondary'),
          body: channel('text-body'),
          tertiary: channel('text-tertiary'),
        },
        accent: channel('accent'),
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        strong: 'var(--border-strong)',
      },
      backgroundColor: {
        glass: 'var(--glass-fill)',
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
      fontFamily: {
        sans: ['"Geist Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"Geist Mono"', ...defaultTheme.fontFamily.mono],
      },
      /* Type scale (spec §4). Families are applied with font-sans / font-mono. */
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.02', letterSpacing: '-0.045em', fontWeight: '500' }],
        'display-lg': ['3.25rem', { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '500' }],
        title: ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        lead: ['1.125rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.55' }],
        button: ['0.9375rem', { lineHeight: '1', fontWeight: '500' }],
        nav: ['0.875rem', { lineHeight: '1' }],
        label: ['0.75rem', { lineHeight: '1', letterSpacing: '0.14em' }],
        'mono-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        hud: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.12em' }],
        panel: ['0.71875rem', { lineHeight: '1.5' }],
        counter: ['2.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      transitionTimingFunction: {
        lab: 'cubic-bezier(0.2, 0.7, 0, 1)',
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
