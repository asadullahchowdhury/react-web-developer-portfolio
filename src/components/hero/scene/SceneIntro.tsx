import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EASE_LAB, gsap, introDurationScale } from '../../../lib/motion';
import { NODES } from './config';
import { sceneState } from './sceneState';

/**
 * 3D intro (spec §9.1), t = 0 when the scene has mounted (canvas ready).
 * Tweens the plain values in `sceneState.intro`; scene objects read them
 * every frame. With reduced motion everything is shown at once.
 *
 * t (s) | object        | animation
 * 0.00  | rings         | draw-on, 0.6
 * 0.00  | dust          | fade in, 1.5
 * 0.30  | pad glow      | opacity, 0.6
 * 0.60  | light cone    | scaleY from floor, 0.6
 * 0.90  | hologram      | uReveal scan top → bottom, 1.2
 * 1.20  | nodes         | scale 0.6 → 1 + opacity, stagger 0.09, 0.5 each
 * 1.40  | orbit line    | draw-on, 0.8
 * 2.20  | packets       | appear and start travelling
 */
const SceneIntro = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const intro = sceneState.intro;
    const keys = ['rings', 'pad', 'cone', 'reveal', 'orbit', 'packets', 'dust'] as const;
    sceneState.motion = !reducedMotion;

    if (reducedMotion) {
      keys.forEach((k) => (intro[k] = 1));
      NODES.forEach((n) => (intro.nodes[n.id] = 1));
      invalidate();
      return;
    }

    keys.forEach((k) => (intro[k] = 0));
    NODES.forEach((n) => (intro.nodes[n.id] = 0));

    const d = introDurationScale();
    const tl = gsap.timeline({ defaults: { ease: EASE_LAB } });
    tl.to(intro, { rings: 1, duration: 0.6 * d }, 0)
      .to(intro, { dust: 1, duration: 1.5 * d }, 0)
      .to(intro, { pad: 1, duration: 0.6 * d }, 0.3)
      .to(intro, { cone: 1, duration: 0.6 * d }, 0.6)
      .to(intro, { reveal: 1, duration: 1.2 * d }, 0.9)
      .to(intro, { orbit: 1, duration: 0.8 * d }, 1.4)
      // Short appear so the whole intro ends by 2.4 s
      .to(intro, { packets: 1, duration: 0.2 * d }, 2.2);
    NODES.forEach((n, i) => {
      tl.to(intro.nodes, { [n.id]: 1, duration: 0.5 * d }, 1.2 + i * 0.09);
    });

    return () => {
      tl.kill();
    };
  }, [reducedMotion, invalidate]);

  return null;
};

export default SceneIntro;
