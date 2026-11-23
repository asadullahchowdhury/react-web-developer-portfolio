import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Static HTML of the page for scripts/prerender.mjs (build time only). */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
