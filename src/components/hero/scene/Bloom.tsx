import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CustomBlending,
  HalfFloatType,
  Mesh,
  OneFactor,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import { BLOOM, BLOOM_LAYER, BLOOM_TARGETS } from './config';
import { sceneState } from './sceneState';

const quadVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** Soft luminance threshold, then 9-tap separable Gaussian. */
const blurFragment = /* glsl */ `
  uniform sampler2D tInput;
  uniform vec2 uDirection;
  uniform float uThreshold;
  uniform float uSmoothing;
  uniform float uApplyThreshold;
  varying vec2 vUv;

  vec4 pick(vec2 uv) {
    vec4 c = texture2D(tInput, uv);
    if (uApplyThreshold > 0.5) {
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb *= smoothstep(uThreshold, uThreshold + uSmoothing, l);
    }
    return c;
  }

  void main() {
    vec4 sum = pick(vUv) * 0.2270270270;
    sum += pick(vUv + uDirection * 1.3846153846) * 0.3162162162;
    sum += pick(vUv - uDirection * 1.3846153846) * 0.3162162162;
    sum += pick(vUv + uDirection * 3.2307692308) * 0.0702702703;
    sum += pick(vUv - uDirection * 3.2307692308) * 0.0702702703;
    gl_FragColor = sum;
  }
`;

/** Adds the blurred glow onto the already-rendered frame (premultiplied alpha). */
const compositeFragment = /* glsl */ `
  uniform sampler2D tBloom;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    vec3 glow = texture2D(tBloom, vUv).rgb * uIntensity;
    gl_FragColor = vec4(glow, 1.0);
    #include <colorspace_fragment>
    gl_FragColor.a = max(max(gl_FragColor.r, gl_FragColor.g), gl_FragColor.b);
  }
`;

/**
 * Selective bloom (spec §6) without a post-processing library.
 *
 * 1. Render the scene normally.
 * 2. Render only BLOOM_LAYER objects (hologram, packets, node dots, pad glow)
 *    into a half-res target.
 * 3. Threshold + blur at quarter res (two separable passes per iteration).
 * 4. Add the glow onto the canvas. The canvas stays transparent, so the
 *    DOM key-light glow behind the stage still shows through.
 *
 * Mounting this takes over rendering (useFrame priority 1); unmounting it
 * hands rendering back to R3F, which is how bloom is switched off.
 */
const Bloom = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  const pipeline = useMemo(() => {
    const options = { type: HalfFloatType, depthBuffer: true };
    const bright = new WebGLRenderTarget(1, 1, options);
    const ping = new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false });
    const pong = new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false });

    const blur = new ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: blurFragment,
      uniforms: {
        tInput: { value: null as Texture | null },
        uDirection: { value: new Vector2() },
        uThreshold: { value: BLOOM.threshold },
        uSmoothing: { value: BLOOM.smoothing },
        uApplyThreshold: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    const composite = new ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: compositeFragment,
      uniforms: {
        tBloom: { value: pong.texture },
        uIntensity: { value: BLOOM.intensity },
      },
      transparent: true,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneFactor,
      depthTest: false,
      depthWrite: false,
    });

    const quad = new Mesh(new PlaneGeometry(2, 2), blur);
    quad.frustumCulled = false;
    const quadScene = new Scene();
    quadScene.add(quad);
    const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    return { bright, ping, pong, blur, composite, quad, quadScene, quadCamera };
  }, []);

  // Tag emissive objects for the bloom layer
  useLayoutEffect(() => {
    scene.traverse((object) => {
      if ((BLOOM_TARGETS as readonly string[]).includes(object.name)) object.layers.enable(BLOOM_LAYER);
    });
  }, [scene]);

  // Size targets to the drawing buffer
  useEffect(() => {
    const w = Math.max(1, Math.round(size.width * dpr));
    const h = Math.max(1, Math.round(size.height * dpr));
    pipeline.bright.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
    pipeline.ping.setSize(Math.ceil(w / 4), Math.ceil(h / 4));
    pipeline.pong.setSize(Math.ceil(w / 4), Math.ceil(h / 4));
  }, [pipeline, size, dpr]);

  useEffect(() => {
    sceneState.bloom = true;
    return () => {
      sceneState.bloom = false;
      const { bright, ping, pong, blur, composite, quad } = pipeline;
      [bright, ping, pong].forEach((t) => t.dispose());
      [blur, composite].forEach((m) => m.dispose());
      quad.geometry.dispose();
    };
  }, [pipeline]);

  useFrame(({ camera }) => {
    const { bright, ping, pong, blur, composite, quad, quadScene, quadCamera } = pipeline;
    const autoClear = gl.autoClear;

    // 1. Normal frame
    gl.setRenderTarget(null);
    gl.render(scene, camera);

    // 2. Emissive objects only
    const cameraLayers = camera.layers.mask;
    camera.layers.set(BLOOM_LAYER);
    const background = scene.background;
    scene.background = null;
    gl.setRenderTarget(bright);
    gl.setClearColor(0x000000, 0);
    gl.clear();
    gl.render(scene, camera);
    camera.layers.mask = cameraLayers;
    scene.background = background;

    // 3. Threshold + blur
    quad.material = blur;
    const texel = 1 / ping.width;
    const texelY = 1 / ping.height;
    let source: Texture = bright.texture;
    for (let i = 0; i < BLOOM.iterations; i++) {
      const spread = 1 + i * BLOOM.radius * 4;
      blur.uniforms.uApplyThreshold.value = i === 0 ? 1 : 0;
      blur.uniforms.tInput.value = source;
      blur.uniforms.uDirection.value.set(texel * spread, 0);
      gl.setRenderTarget(ping);
      gl.render(quadScene, quadCamera);

      blur.uniforms.uApplyThreshold.value = 0;
      blur.uniforms.tInput.value = ping.texture;
      blur.uniforms.uDirection.value.set(0, texelY * spread);
      gl.setRenderTarget(pong);
      gl.render(quadScene, quadCamera);
      source = pong.texture;
    }

    // 4. Add glow onto the canvas
    quad.material = composite;
    gl.setRenderTarget(null);
    gl.autoClear = false;
    gl.render(quadScene, quadCamera);
    gl.autoClear = autoClear;
  }, 1);

  return null;
};

export default Bloom;
