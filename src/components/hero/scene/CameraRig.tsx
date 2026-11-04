import { type RefObject, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import { CAMERA } from './config';
import { sceneState } from './sceneState';

const DEG = Math.PI / 180;

/** Parallax response per unit of pointer (spec §10). */
const PARALLAX = {
  rootYaw: 4 * DEG,
  rootPitch: 2.5 * DEG,
  cameraX: 0.15,
};

/**
 * Camera at its rest framing (spec §7.2) plus mouse parallax on the scene
 * root and camera (§10). Runs at priority −1, before every other frame
 * callback, so labels project with this frame's camera. The scroll dolly
 * is added on top of this in the scroll step.
 */
const CameraRig = ({ root }: { root: RefObject<Group> }) => {
  const camera = useThree((s) => s.camera);
  const [rx, ry, rz] = CAMERA.rest.position;
  const [lx, ly, lz] = CAMERA.rest.lookAt;

  useLayoutEffect(() => {
    camera.position.set(rx, ry, rz);
    camera.lookAt(lx, ly, lz);
  }, [camera, rx, ry, rz, lx, ly, lz]);

  useFrame(() => {
    const { x, y } = sceneState.pointer;
    if (root.current) {
      root.current.rotation.y = x * PARALLAX.rootYaw;
      root.current.rotation.x = -y * PARALLAX.rootPitch;
    }
    camera.position.set(rx + x * PARALLAX.cameraX, ry, rz);
    camera.lookAt(lx, ly, lz);
  }, -1);

  return null;
};

export default CameraRig;
