import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, ShaderMaterial } from 'three';
import { COLORS, FOG, WORLD } from './config';
import { seededRandom } from './geometry';

const dustVertex = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uPixelRatio;
  uniform float uFogNear;
  uniform float uFogFar;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float fog = 1.0 - smoothstep(uFogNear, uFogFar, -mvPosition.z);
    vAlpha = aAlpha * fog;
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

/** Fine dust filling the volume (spec §8 #10). Round sprites, 1–1.5 CSS px. */
const Dust = ({ mobile }: { mobile: boolean }) => {
  const count = mobile ? WORLD.dust.mobile : WORLD.dust.desktop;

  const { geometry, material } = useMemo(() => {
    const rand = seededRandom(7);
    const { x, y, z } = WORLD.dust.bounds;
    const positions: number[] = [];
    const sizes: number[] = [];
    const alphas: number[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        x[0] + rand() * (x[1] - x[0]),
        y[0] + rand() * (y[1] - y[0]),
        z[0] + rand() * (z[1] - z[0]),
      );
      sizes.push(1 + rand() * 0.5);
      alphas.push(0.3 + rand() * 0.2);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
    geo.setAttribute('aAlpha', new Float32BufferAttribute(alphas, 1));

    const mat = new ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      uniforms: {
        uColor: { value: new Color(COLORS.dust) },
        uOpacity: { value: 1 },
        uPixelRatio: { value: 1 },
        uFogNear: { value: FOG.near },
        uFogFar: { value: FOG.far },
      },
      transparent: true,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame(({ viewport }) => {
    material.uniforms.uPixelRatio.value = viewport.dpr;
  });

  return <points name="dust" geometry={geometry} material={material} renderOrder={4} />;
};

export default Dust;
