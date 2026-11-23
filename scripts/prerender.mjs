/**
 * Build step: renders <App /> to static HTML and puts it inside #root in
 * dist/index.html, so search engines and link previews get the real page
 * text without running JavaScript. The browser still mounts the app with
 * createRoot (src/main.tsx), which replaces this markup.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// Production mode, so dev-only code (window.__labState etc.) is skipped like in the real build
process.env.NODE_ENV = 'production';

const root = fileURLToPath(new URL('..', import.meta.url));
const htmlPath = `${root}dist/index.html`;

const vite = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
  const appHtml = render();
  const html = readFileSync(htmlPath, 'utf8');
  if (!html.includes('<div id="root"></div>')) throw new Error('#root not found in dist/index.html');
  writeFileSync(htmlPath, html.replace('<div id="root"></div>', `<div id="root" data-prerendered>${appHtml}</div>`));
  console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
} finally {
  await vite.close();
}
