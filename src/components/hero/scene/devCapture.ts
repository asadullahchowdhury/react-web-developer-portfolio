import type { RootState } from '@react-three/fiber';
import { type PerspectiveCamera, type ShaderMaterial, Vector2 } from 'three';
import { CAMERA } from './config';
import { sceneState } from './sceneState';

/**
 * Dev-only: renders the scene at its rest framing (intro complete, no scroll,
 * no parallax) into a still for the scene poster (spec §13, §14), and posts
 * it to the dev server, which saves it under public/assets/lab/.
 *
 * Usage in the browser console on the dev server:
 *   await __labCapture('desktop', 1360, 1360)  // stage 680 × 680 at 2×
 *   await __labCapture('mobile', 780, 660)     // stage 390 × 330 at 2×
 *
 * Node labels are DOM text, so they are not part of the still.
 */
export function attachDevCapture(state: RootState) {
  const capture = async (variant: 'desktop' | 'mobile', width: number, height: number, quality = 0.82) => {
    const { gl, scene } = state;
    const camera = state.camera as PerspectiveCamera;
    const scale = 2;

    // Save everything we touch
    const prev = {
      size: gl.getSize(new Vector2()),
      dpr: gl.getPixelRatio(),
      aspect: camera.aspect,
      fov: camera.fov,
      view: camera.view ? { ...camera.view } : null,
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
      pointer: { ...sceneState.pointer },
      scroll: sceneState.scrollProgress,
    };
    const root = scene.getObjectByName('lab-root');
    const rootRotation = root?.rotation.clone();
    const pixelRatioUniforms: { material: ShaderMaterial; value: number }[] = [];
    scene.traverse((object) => {
      const material = (object as { material?: ShaderMaterial }).material;
      if (material?.uniforms?.uPixelRatio) {
        pixelRatioUniforms.push({ material, value: material.uniforms.uPixelRatio.value });
        material.uniforms.uPixelRatio.value = scale; // keep scanline pitch / dust size in CSS px
      }
    });

    // Rest framing
    sceneState.pointer.x = 0;
    sceneState.pointer.y = 0;
    sceneState.scrollProgress = 0;
    root?.rotation.set(0, 0, 0);
    gl.setPixelRatio(1);
    gl.setSize(width, height, false);
    camera.clearViewOffset();
    camera.aspect = width / height;
    camera.fov = CAMERA.rest.fov;
    camera.position.set(...CAMERA.rest.position);
    camera.lookAt(...CAMERA.rest.lookAt);
    camera.updateProjectionMatrix();

    // Opaque on pure black: additive light has almost no alpha, so a
    // transparent still would lose it. The poster is shown with
    // mix-blend-mode: screen, under which black is exactly invisible.
    gl.setClearColor(0x000000, 1);
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL('image/webp', quality);
    gl.setClearColor(0x000000, 0);

    // Restore
    pixelRatioUniforms.forEach(({ material, value }) => (material.uniforms.uPixelRatio.value = value));
    root?.rotation.copy(rootRotation!);
    Object.assign(sceneState.pointer, prev.pointer);
    sceneState.scrollProgress = prev.scroll;
    gl.setPixelRatio(prev.dpr);
    gl.setSize(prev.size.x, prev.size.y, false);
    camera.aspect = prev.aspect;
    camera.fov = prev.fov;
    if (prev.view) {
      const v = prev.view;
      camera.setViewOffset(v.fullWidth, v.fullHeight, v.offsetX, v.offsetY, v.width, v.height);
    }
    camera.position.copy(prev.position);
    camera.quaternion.copy(prev.quaternion);
    camera.updateProjectionMatrix();
    state.invalidate();

    const blob = await (await fetch(dataUrl)).blob();
    const res = await fetch('/__dev/save-scene-poster', {
      method: 'POST',
      headers: { 'x-name': `scene-poster-${variant}.webp` },
      body: blob,
    });
    return `${await res.text()} — ${width}×${height}, ${Math.round(blob.size / 1024)} KB`;
  };

  (window as unknown as { __labCapture: typeof capture }).__labCapture = capture;
}
