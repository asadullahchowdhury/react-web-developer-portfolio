import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, ShaderMaterial } from 'three';
import { COLORS, FOG, WORLD } from './config';
import { seededRandom } from './geometry';
import { sceneState } from './sceneState';

/** Upward drift in world units per second (spec §9.2). */
const RISE_SPEED = 0.02;
const SWAY = 0.06;

const dustVertex = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  uniform float uPixelRatio;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTime;
  uniform float uYMin;
  uniform float uYRange;
  uniform float uRise;
  uniform float uSway;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Rise and wrap at the top; sway sideways a little
    float h = mod(p.y - uYMin + uTime * uRise, uYRange);
    p.y = uYMin + h;
    p.x += sin(uTime * 0.25 + aPhase) * uSway;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float fog = 1.0 - smoothstep(uFogNear, uFogFar, -mvPosition.z);
    // Fade near the wrap so particles never pop
    float t = h / uYRange;
    float edges = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.88, 1.0, t));
    vAlpha = aAlpha * fog * edges;
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * uOpacity * smoothstep(0.5, 0.2, d));
    #include <colorspace_fragment>
  }
`;

/** Fine dust filling the volume (spec §8 #10, §9.2). Round sprites, 1–1.5 CSS px. */
const Dust = ({ mobile, density = 1 }: { mobile: boolean; density?: number }) => {
  const count = mobile ? WORLD.dust.mobile : WORLD.dust.desktop;

  const { geometry, material } = useMemo(() => {
    const rand = seededRandom(7);
    const { x, y, z } = WORLD.dust.bounds;
    const positions: number[] = [];
    const sizes: number[] = [];
    const alphas: number[] = [];
    const phases: number[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        x[0] + rand() * (x[1] - x[0]),
        y[0] + rand() * (y[1] - y[0]),
        z[0] + rand() * (z[1] - z[0]),
      );
      sizes.push(1 + rand() * 0.5);
      alphas.push(0.3 + rand() * 0.2);
      phases.push(rand() * Math.PI * 2);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
    geo.setAttribute('aAlpha', new Float32BufferAttribute(alphas, 1));
    geo.setAttribute('aPhase', new Float32BufferAttribute(phases, 1));
    // Points move in the shader, so give them generous bounds for culling
    geo.computeBoundingSphere();
    if (geo.boundingSphere) geo.boundingSphere.radius += 2;

    const mat = new ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      uniforms: {
        uColor: { value: new Color(COLORS.dust) },
        uOpacity: { value: 0 },
        uPixelRatio: { value: 1 },
        uFogNear: { value: FOG.near },
        uFogFar: { value: FOG.far },
        uTime: { value: 0 },
        uYMin: { value: y[0] },
        uYRange: { value: y[1] - y[0] },
        uRise: { value: RISE_SPEED },
        uSway: { value: SWAY },
      },
      transparent: true,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, [count]);

  // Low-end mode draws only part of the (already shuffled) field
  useEffect(() => {
    geometry.setDrawRange(0, Math.floor(count * density));
  }, [geometry, count, density]);

  useFrame(({ viewport }, delta) => {
    const u = material.uniforms;
    u.uPixelRatio.value = viewport.dpr;
    u.uOpacity.value = sceneState.intro.dust;
    // Advance only while idle loops run; clamp so a paused tab doesn't jump
    if (sceneState.motion) u.uTime.value += Math.min(delta, 0.1);
  });

  return <points name="dust" geometry={geometry} material={material} renderOrder={4} />;
};

export default Dust;
