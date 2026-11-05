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

/**
 * Mobile only (POLISH P2-16): the poster floats ±4 px over 6 s and a soft glow
 * pulses on the platform, so the still doesn't look frozen before the scene
 * starts on first touch. CSS in index.css; off with reduced motion.
 */
const ScenePoster = () => (
  // Screen-blended as a group: the float's transform isolates the children,
  // so the blend sits on the moving wrapper
  <div aria-hidden="true" className="absolute inset-0 mix-blend-screen" data-scene-poster>
    <picture>
      <source media="(max-width: 767px)" srcSet={POSTER.mobile} width={780} height={660} />
      <img
        src={POSTER.desktop}
        width={1360}
        height={1360}
        alt=""
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
    {/* Platform glow (mobile poster framing: platform centre at 50% / 73.5%) */}
    <span
      data-platform-pulse
      className="pointer-events-none absolute left-1/2 top-[73.5%] hidden h-[26px] w-[124px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(156_201_255/0.55),rgb(156_201_255/0))] mix-blend-screen max-md:block"
    />
  </div>
);

export default ScenePoster;
