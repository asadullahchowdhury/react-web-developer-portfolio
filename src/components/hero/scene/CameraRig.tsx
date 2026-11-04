import { type RefObject, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { type Group, MathUtils, type PerspectiveCamera, Vector3 } from 'three';
import { CAMERA } from './config';
import { sceneState } from './sceneState';

const DEG = Math.PI / 180;

/** Parallax response per unit of pointer (spec §10). */
const PARALLAX = {
  rootYaw: 4 * DEG,
  rootPitch: 2.5 * DEG,
  cameraX: 0.15,
};

/** The dolly runs over the first 35% of the hero pin (spec §11.1). */
const DOLLY_END = 0.35;

/**
 * Camera framing: rest → end-of-dolly by scroll (spec §7.2, §11.1), plus
 * mouse parallax on the scene root and camera (§10). Runs at priority −1,
 * before every other frame callback, so labels project with this frame's
 * camera.
 */
const CameraRig = ({ root }: { root: RefObject<Group> }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;

  const v = useMemo(
    () => ({
      restPos: new Vector3(...CAMERA.rest.position),
      endPos: new Vector3(...CAMERA.dollyEnd.position),
      restLook: new Vector3(...CAMERA.rest.lookAt),
      endLook: new Vector3(...CAMERA.dollyEnd.lookAt),
      pos: new Vector3(),
      look: new Vector3(),
    }),
    [],
  );

  useLayoutEffect(() => {
    camera.position.copy(v.restPos);
    camera.lookAt(v.restLook);
  }, [camera, v]);

  useFrame(() => {
    const { pointer, scrollProgress } = sceneState;

    // Scroll dolly, eased so it starts and settles gently
    const d = MathUtils.smoothstep(Math.min(scrollProgress / DOLLY_END, 1), 0, 1);
    v.pos.lerpVectors(v.restPos, v.endPos, d);
    v.look.lerpVectors(v.restLook, v.endLook, d);
    const fov = MathUtils.lerp(CAMERA.rest.fov, CAMERA.dollyEnd.fov, d);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Mouse parallax on top
    if (root.current) {
      root.current.rotation.y = pointer.x * PARALLAX.rootYaw;
      root.current.rotation.x = -pointer.y * PARALLAX.rootPitch;
    }
    camera.position.set(v.pos.x + pointer.x * PARALLAX.cameraX, v.pos.y, v.pos.z);
    camera.lookAt(v.look);
  }, -1);

  return null;
};

export default CameraRig;
