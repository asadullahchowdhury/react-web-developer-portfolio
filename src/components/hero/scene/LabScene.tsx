import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { CAMERA, FOG, LIGHTS } from './config';

/**
 * Scene root: fog, lights and the camera's rest framing (spec §6, §7.2).
 * Scene objects are added in the next step; the camera rig replaces the
 * one-off lookAt once the dolly and parallax exist.
 */
const LabScene = () => {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    const [x, y, z] = CAMERA.rest.lookAt;
    camera.lookAt(x, y, z);
  }, [camera]);

  return (
    <>
      <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />

      <hemisphereLight
        args={[LIGHTS.ambient.sky, LIGHTS.ambient.ground, LIGHTS.ambient.intensity]}
      />
      <directionalLight
        position={[...LIGHTS.key.position]}
        color={LIGHTS.key.color}
        intensity={LIGHTS.key.intensity}
      />
      <directionalLight
        position={[...LIGHTS.rim.position]}
        color={LIGHTS.rim.color}
        intensity={LIGHTS.rim.intensity}
      />

      <group name="lab-root">{/* Platform, cone, hologram, orbit, dust — next step */}</group>
    </>
  );
};

export default LabScene;
