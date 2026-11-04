/**
 * Static render of the scene at rest framing, shown until the canvas has drawn
 * its first frame, and kept permanently when WebGL is unavailable (spec §13).
 *
 * The poster images are rendered from the finished scene (spec §14), so until
 * they exist this renders an empty layer that reserves the same box.
 */
const POSTER_SRC = null as { desktop: string; mobile: string } | null;

const ScenePoster = () => {
  if (!POSTER_SRC) {
    return <div aria-hidden="true" className="absolute inset-0" data-scene-poster />;
  }

  return (
    <picture aria-hidden="true" className="absolute inset-0" data-scene-poster>
      <source media="(max-width: 767px)" srcSet={POSTER_SRC.mobile} />
      <img
        src={POSTER_SRC.desktop}
        alt=""
        decoding="async"
        className="h-full w-full object-contain"
      />
    </picture>
  );
};

export default ScenePoster;
