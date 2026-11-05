/**
 * Device / preference checks that decide how the hero scene runs (spec §12–13).
 * All functions are safe to call during render on the client.
 */

const media = (query: string) =>
  typeof window !== 'undefined' && window.matchMedia(query).matches;

/** Dev-only URL overrides for testing, e.g. `?webgl=0`, `?mobile=0`, `?motion=reduce`. */
const devOverride = (key: string): string | null =>
  import.meta.env.DEV ? new URLSearchParams(window.location.search).get(key) : null;

export const prefersReducedMotion = () =>
  devOverride('motion') === 'reduce' || media('(prefers-reduced-motion: reduce)');

/** Mobile rules apply below 768px or on coarse pointers (spec §12). */
export const isMobileLike = () => {
  const forced = devOverride('mobile');
  if (forced !== null) return forced === '1';
  return media('(max-width: 767px)') || media('(pointer: coarse)');
};

/** Mouse parallax and hover only on precise, hover-capable pointers (spec §10). */
export const hasFinePointer = () => media('(pointer: fine) and (hover: hover)');

let webglSupport: boolean | undefined;

/** Renderers that emulate the GPU on the CPU: the scene would stall the main thread. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * True when a hardware-accelerated WebGL context can be created. Software
 * renderers (no GPU, or GPU blocklisted) count as unsupported: compiling and
 * drawing the scene there takes ~1 s of main-thread time, so the static poster
 * is the better experience. Probes once, then releases the test context so it
 * does not count against the browser's context limit.
 * Dev builds accept `?webgl=0` to force the no-WebGL fallback.
 */
export function supportsWebGL(): boolean {
  if (devOverride('webgl') === '0') return false;
  if (webglSupport !== undefined) return webglSupport;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    let hardware = !!gl;
    if (gl) {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      if (SOFTWARE_RENDERER.test(renderer)) hardware = false;
    }
    webglSupport = hardware;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}
