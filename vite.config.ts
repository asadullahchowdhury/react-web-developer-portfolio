import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Adds <link rel="preload"> for the critical Geist woff2 files (spec §13).
 * File names are hashed at build time, so the links are injected from the bundle.
 * Dev builds skip this — fonts still load normally from the CSS.
 */
const CRITICAL_FONTS = [
  /geist-sans-latin-400-normal-.*\.woff2$/,
  /geist-sans-latin-500-normal-.*\.woff2$/,
  /geist-mono-latin-400-normal-.*\.woff2$/,
];

function preloadFonts(): Plugin {
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      if (!ctx.bundle) return;
      return Object.keys(ctx.bundle)
        .filter((file) => CRITICAL_FONTS.some((re) => re.test(file)))
        .map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        }));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
