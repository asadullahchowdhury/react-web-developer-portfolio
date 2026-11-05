import { EASE_LAB, gsap } from '../../../lib/motion';
import { sceneState } from './sceneState';

/**
 * Short version of the 3D intro (POLISH P2-17), played when "Back to top"
 * arrives: rings draw on again and the hologram scans in, 800 ms in all.
 * Does nothing until the scene has mounted with motion (poster, no WebGL or
 * reduced motion).
 */
export function replaySceneIntro() {
  if (!sceneState.motion) return;
  const intro = sceneState.intro;
  gsap.killTweensOf(intro, 'rings,reveal');
  gsap
    .timeline({ defaults: { ease: EASE_LAB } })
    .fromTo(intro, { rings: 0 }, { rings: 1, duration: 0.45 }, 0)
    .fromTo(intro, { reveal: 0 }, { reveal: 1, duration: 0.6 }, 0.2);
}
