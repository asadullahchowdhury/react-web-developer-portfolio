import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
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

/**
 * Dev-server only: saves a rendered scene poster posted by the page's
 * `window.__labCapture` helper into public/assets/lab/. Only the two poster
 * file names are accepted. Not part of production builds.
 */
const POSTER_NAMES = /^scene-poster-(desktop|mobile)\.webp$/;
const LAB_ASSETS = fileURLToPath(new URL('./public/assets/lab/', import.meta.url));

function saveScenePoster(): Plugin {
  return {
    name: 'dev-save-scene-poster',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev/save-scene-poster', (req, res) => {
        const name = String(req.headers['x-name'] ?? '');
        if (req.method !== 'POST' || !POSTER_NAMES.test(name)) {
          res.statusCode = 400;
          res.end('bad request');
          return;
        }
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('end', () => {
          const data = Buffer.concat(chunks);
          writeFileSync(LAB_ASSETS + name, data);
          res.end(`saved ${name} (${data.length} bytes)`);
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts(), saveScenePoster()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
