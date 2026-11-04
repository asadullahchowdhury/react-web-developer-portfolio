import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, type Mesh, ShaderMaterial, SRGBColorSpace, TextureLoader } from 'three';
import { COLORS, WORLD } from './config';
import { sceneState } from './sceneState';
import { hologramFragment, hologramVertex } from './shaders/hologram';

const MASK_SIZE = 1024;
const HOLOGRAM_YAW = (6 * Math.PI) / 180;
const HOLOGRAM_PITCH = (3 * Math.PI) / 180;

/**
 * Placeholder hologram: a plane that turns to face the camera (yaw only),
 * drawn by the hologram shader from a single mask texture (spec §8.1).
 */
const Hologram = () => {
  const mesh = useRef<Mesh>(null);
  const mask = useLoader(TextureLoader, WORLD.hologram.maskUrl);
  mask.colorSpace = SRGBColorSpace;

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: hologramVertex,
        fragmentShader: hologramFragment,
        uniforms: {
          uMask: { value: mask },
          uColor: { value: new Color(COLORS.signal) },
          uRim: { value: new Color(COLORS.signalSoft) },
          uOpacity: { value: WORLD.hologram.opacity },
          uReveal: { value: 1 },
          uFlicker: { value: 1 },
          uLinePitch: { value: WORLD.hologram.linePitch },
          uPixelRatio: { value: 1 },
          uEdge: { value: 3 / MASK_SIZE },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      }),
    [mask],
  );

  const { height, baseY } = WORLD.hologram;
  const flicker = useRef({ next: 2 + Math.random() * 4, until: 0 });

  useFrame(({ camera, viewport, clock }) => {
    const m = mesh.current;
    if (!m) return;
    const u = material.uniforms;
    const t = clock.elapsedTime;
    u.uPixelRatio.value = viewport.dpr;
    u.uReveal.value = sceneState.intro.reveal;

    if (sceneState.motion) {
      // Float ±0.03 units, 6 s sine (spec §9.2)
      m.position.y = baseY + height / 2 + Math.sin((t / 6) * Math.PI * 2) * 0.03;

      // Brief dip below 3% opacity at random 2–6 s intervals; never strobes
      const f = flicker.current;
      if (t >= f.next) {
        f.until = t + 0.08 + Math.random() * 0.06;
        f.next = t + 2 + Math.random() * 4;
      }
      u.uFlicker.value = t < f.until ? 0.975 : 1;
    } else {
      m.position.y = baseY + height / 2;
      u.uFlicker.value = 1;
    }

    // Face the camera around Y only, so the figure stays upright, then turn
    // toward the pointer: yaw x × 6°, pitch y × 3° (spec §10)
    const { x, y } = sceneState.pointer;
    m.rotation.y =
      Math.atan2(camera.position.x - m.position.x, camera.position.z - m.position.z) + x * HOLOGRAM_YAW;
    m.rotation.x = y * HOLOGRAM_PITCH;
  });

  return (
    <mesh ref={mesh} name="hologram" position={[0, baseY + height / 2, 0]} material={material} renderOrder={3}>
      <planeGeometry args={[height, height]} />
    </mesh>
  );
};

export default Hologram;
