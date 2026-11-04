import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PERF } from './config';
import { sceneState } from './sceneState';

const SAMPLE_SECONDS = 0.5;
/** Frame gaps longer than this (tab switch, pause) restart the measurement. */
const MAX_DELTA = 0.25;

/**
 * Low-end detection (spec §13): if the frame rate stays below PERF.minFps
 * for PERF.sustainSeconds, call `onDegrade` once. Measures only while the
 * render loop is active, after a short warm-up.
 */
const QualityMonitor = ({ onDegrade }: { onDegrade: () => void }) => {
  const m = useRef({ elapsed: 0, frames: 0, window: 0, slowFor: 0, done: false });

  useFrame((_, delta) => {
    const s = m.current;
    if (s.done || !sceneState.rendering) return;
    if (delta > MAX_DELTA) {
      s.frames = 0;
      s.window = 0;
      return;
    }

    s.elapsed += delta;
    if (s.elapsed < PERF.warmupSeconds) return;

    s.frames += 1;
    s.window += delta;
    if (s.window < SAMPLE_SECONDS) return;

    const fps = s.frames / s.window;
    s.frames = 0;
    s.window = 0;
    sceneState.fps = Math.round(fps);
    s.slowFor = fps < PERF.minFps ? s.slowFor + SAMPLE_SECONDS : 0;

    if (s.slowFor >= PERF.sustainSeconds) {
      s.done = true;
      onDegrade();
    }
  });

  return null;
};

export default QualityMonitor;
