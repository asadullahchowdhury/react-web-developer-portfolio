import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, type Mesh, ShaderMaterial, SRGBColorSpace, TextureLoader } from 'three';
import { COLORS, WORLD } from './config';
import { hologramFragment, hologramVertex } from './shaders/hologram';

const MASK_SIZE = 1024;

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

  // Face the camera around Y only, so the figure stays upright
  useFrame(({ camera, viewport }) => {
    material.uniforms.uPixelRatio.value = viewport.dpr;
    const m = mesh.current;
    if (!m) return;
    m.rotation.y = Math.atan2(camera.position.x - m.position.x, camera.position.z - m.position.z);
  });

  const { height, baseY } = WORLD.hologram;

  return (
    <mesh ref={mesh} name="hologram" position={[0, baseY + height / 2, 0]} material={material} renderOrder={3}>
      <planeGeometry args={[height, height]} />
    </mesh>
  );
};

export default Hologram;
