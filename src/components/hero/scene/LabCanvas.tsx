import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import LabScene from './LabScene';
import type { Frameloop } from './RenderLoop';
import { CAMERA, DPR } from './config';

export interface LabCanvasProps {
  mobile: boolean;
  reducedMotion: boolean;
  /** Called once the first frame has been drawn, so the poster can fade out. */
  onReady: () => void;
  /** Called if the WebGL context is lost; the poster then stays. */
  onContextLost: () => void;
}

/** Fires `onReady` after the first rendered frame has reached the screen. */
const FirstFrameSignal = ({ onReady }: { onReady: () => void }) => {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    requestAnimationFrame(() => onReady());
  });
  return null;
};

/**
 * React Three Fiber canvas for the hero lab. Loaded lazily as its own chunk
 * (spec §13) so three.js never blocks the first paint.
 */
const LabCanvas = ({ mobile, reducedMotion, onReady, onContextLost }: LabCanvasProps) => {
  // Driven by <RenderLoop> (visibility, reduced motion); see its note
  const [frameloop, setFrameloop] = useState<Frameloop>('demand');

  return (
    <Canvas
      aria-hidden="true"
      frameloop={frameloop}
      dpr={mobile ? DPR.mobile : DPR.desktop}
      camera={{
        fov: CAMERA.rest.fov,
        position: [...CAMERA.rest.position],
        near: CAMERA.near,
        far: CAMERA.far,
      }}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault();
            onContextLost();
          },
          { once: true },
        );
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* The first-frame signal sits inside the same boundary, so the poster
          only fades once the mask texture has loaded and the scene is complete. */}
      <Suspense fallback={null}>
        <LabScene mobile={mobile} reducedMotion={reducedMotion} onFrameloopChange={setFrameloop} />
        <FirstFrameSignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
};

export default LabCanvas;
