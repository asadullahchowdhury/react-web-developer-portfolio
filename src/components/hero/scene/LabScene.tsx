import { useCallback, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import type { Group } from 'three';
import CameraRig from './CameraRig';
import Bloom from './Bloom';
import Dust from './Dust';
import Hologram from './Hologram';
import LightCone from './LightCone';
import Orbit from './Orbit';
import Platform from './Platform';
import QualityMonitor from './QualityMonitor';
import RenderLoop, { type Frameloop } from './RenderLoop';
import SceneIntro from './SceneIntro';
import { FOG, LIGHTS } from './config';
import { sceneState } from './sceneState';
import { hasFinePointer } from '../../../lib/capabilities';

interface LabSceneProps {
  mobile: boolean;
  reducedMotion: boolean;
  onFrameloopChange: (mode: Frameloop) => void;
}

/**
 * Scene root: fog, lights, camera rest framing, every scene object, and the
 * performance controls (spec §6–8, §13). Camera framing and parallax live in CameraRig.
 */
const LabScene = ({ mobile, reducedMotion, onFrameloopChange }: LabSceneProps) => {
  const setDpr = useThree((state) => state.setDpr);
  const root = useRef<Group>(null);
  const [quality, setQuality] = useState<'high' | 'low'>('high');

  /** Low-end fallback: no bloom, half the dust, DPR 1. */
  const degrade = useCallback(() => {
    sceneState.quality = 'low';
    setQuality('low');
    setDpr(1);
  }, [setDpr]);

  // Node hover only with a precise, hover-capable pointer (spec §10)
  const [interactive] = useState(() => !mobile && hasFinePointer());

  // Mobile never blooms (spec §12); desktop drops it when degraded
  const bloom = !mobile && quality === 'high';

  return (
    <>
      <RenderLoop animate={!reducedMotion} onChange={onFrameloopChange} />
      <SceneIntro reducedMotion={reducedMotion} />
      <CameraRig root={root} />
      {!reducedMotion && <QualityMonitor onDegrade={degrade} />}

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

      <group ref={root} name="lab-root">
        <Platform />
        <LightCone />
        <Hologram />
        <Orbit interactive={interactive} />
        <Dust mobile={mobile} density={quality === 'high' ? 1 : 0.5} />
      </group>

      {bloom && <Bloom />}
    </>
  );
};

export default LabScene;
