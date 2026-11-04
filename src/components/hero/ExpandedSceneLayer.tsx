import { type RefObject, useEffect, useRef } from 'react';
import { gsap } from '../../lib/motion';
import SceneCanvas from './SceneCanvas';
import { sceneState } from './scene/sceneState';
import type { LabCanvasControl } from './useLabCanvas';

/** Soft edge of the mask, in CSS px. */
const FEATHER = 64;
/** The mask is fully open by the end of the camera dolly (spec §11.1). */
const OPEN_BY = 0.35;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Hero-wide canvas layer used with the desktop pin.
 *
 * The camera dolly (spec §11.1) pushes the scene past the stage box, so the
 * canvas covers the whole hero instead. The camera keeps its rest framing by
 * treating the stage as its reference frame (`sceneState.view` →
 * setViewOffset in CameraRig). A feathered mask limits the visible area to
 * the stage at rest and opens to the full hero as the dolly runs, so the
 * scene never meets a hard edge.
 */
const ExpandedSceneLayer = ({
  control,
  stageRef,
}: {
  control: LabCanvasControl;
  stageRef: RefObject<HTMLDivElement>;
}) => {
  const layerRef = useRef<HTMLDivElement>(null);

  // Keep the stage rect (relative to this layer) in sync for the camera and mask
  useEffect(() => {
    const layer = layerRef.current;
    const stage = stageRef.current;
    if (!layer || !stage) return;

    const view = sceneState.view;
    const measure = () => {
      const l = layer.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      view.x = s.left - l.left;
      view.y = s.top - l.top;
      view.width = Math.max(1, s.width);
      view.height = Math.max(1, s.height);
      view.layerWidth = Math.max(1, l.width);
      view.layerHeight = Math.max(1, l.height);
    };
    measure();
    view.enabled = true;

    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    observer.observe(stage);

    // Mask: stage rect at rest → whole layer by the end of the dolly
    let last = '';
    const updateMask = () => {
      const open = smoothstep(Math.min(Math.max(sceneState.scrollProgress / OPEN_BY, 0), 1));
      const inset = (edge: number) => Math.round(edge * (1 - open));
      const left = inset(view.x);
      const top = inset(view.y);
      const right = inset(view.layerWidth - view.x - view.width);
      const bottom = inset(view.layerHeight - view.y - view.height);
      const key = `${left},${top},${right},${bottom}`;
      if (key === last) return;
      last = key;
      layer.style.setProperty('--mask-l', `${left}px`);
      layer.style.setProperty('--mask-t', `${top}px`);
      layer.style.setProperty('--mask-r', `${right}px`);
      layer.style.setProperty('--mask-b', `${bottom}px`);
    };
    updateMask();
    gsap.ticker.add(updateMask);

    return () => {
      observer.disconnect();
      gsap.ticker.remove(updateMask);
      view.enabled = false;
    };
  }, [stageRef]);

  const mask = [
    `linear-gradient(to right, transparent calc(var(--mask-l) - ${FEATHER}px), #000 var(--mask-l), #000 calc(100% - var(--mask-r)), transparent calc(100% - var(--mask-r) + ${FEATHER}px))`,
    `linear-gradient(to bottom, transparent calc(var(--mask-t) - ${FEATHER}px), #000 var(--mask-t), #000 calc(100% - var(--mask-b)), transparent calc(100% - var(--mask-b) + ${FEATHER}px))`,
  ].join(', ');

  return (
    <div
      ref={layerRef}
      data-scene-layer
      data-scene-expanded
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
    >
      <SceneCanvas control={control} />
    </div>
  );
};

export default ExpandedSceneLayer;
