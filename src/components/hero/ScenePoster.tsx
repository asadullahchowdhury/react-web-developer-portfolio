/**
 * Static render of the scene at rest framing (spec §13, §14), shown until the
 * canvas has drawn its first frame and kept permanently when WebGL is
 * unavailable. Same framing as the stage, so swapping causes no layout shift.
 *
 * Rendered from the live scene on the dev server with
 * `__labCapture('desktop', 1360, 1360)` and `__labCapture('mobile', 780, 660)`
 * (see scene/devCapture.ts). The stills are opaque on pure black and drawn
 * with `mix-blend-mode: screen`, so the black drops out exactly and only the
 * light remains, over the key-light glow behind the stage.
 */
const POSTER = {
  desktop: '/assets/lab/scene-poster-desktop.webp',
  mobile: '/assets/lab/scene-poster-mobile.webp',
};

const ScenePoster = () => (
  <picture aria-hidden="true" className="absolute inset-0" data-scene-poster>
    <source media="(max-width: 767px)" srcSet={POSTER.mobile} width={780} height={660} />
    <img
      src={POSTER.desktop}
      width={1360}
      height={1360}
      alt=""
      decoding="async"
      className="h-full w-full object-cover mix-blend-screen"
    />
  </picture>
);

export default ScenePoster;
