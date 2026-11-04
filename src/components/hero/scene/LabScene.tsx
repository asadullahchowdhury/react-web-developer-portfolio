import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import Dust from './Dust';
import Hologram from './Hologram';
import LightCone from './LightCone';
import Orbit from './Orbit';
import Platform from './Platform';
import { CAMERA, FOG, LIGHTS } from './config';

/**
 * Scene root: fog, lights, camera rest framing and every scene object
 * (spec §6–8). The camera rig replaces the one-off lookAt once the dolly
 * and parallax exist.
 */
const LabScene = ({ mobile }: { mobile: boolean }) => {
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

      <group name="lab-root">
        <Platform />
        <LightCone />
        <Hologram />
        <Orbit />
        <Dust mobile={mobile} />
      </group>
    </>
  );
};

export default LabScene;
