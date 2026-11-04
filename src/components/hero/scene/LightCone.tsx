import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, CylinderGeometry, DoubleSide, type Mesh, ShaderMaterial } from 'three';
import { COLORS, WORLD } from './config';
import { sceneState } from './sceneState';

const coneVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-mvPosition.xyz)));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** Vertical falloff `uOpacity` → 0, softened toward the silhouette edges. */
const coneFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    float vertical = pow(1.0 - vUv.y, 1.3);
    float edges = smoothstep(0.0, 0.55, vFacing);
    gl_FragColor = vec4(uColor, uOpacity * vertical * edges);
    #include <colorspace_fragment>
  }
`;

/** Open light cone rising from the pad (spec §8 #4). Grows from the floor via scale.y. */
const LightCone = () => {
  const mesh = useRef<Mesh>(null);
  const { bottomRadius, topRadius, height, opacity } = WORLD.cone;

  const { geometry, material } = useMemo(() => {
    const geo = new CylinderGeometry(topRadius, bottomRadius, height, 64, 1, true);
    geo.translate(0, height / 2, 0);
    const mat = new ShaderMaterial({
      vertexShader: coneVertex,
      fragmentShader: coneFragment,
      uniforms: {
        uColor: { value: new Color(COLORS.signal) },
        uOpacity: { value: opacity },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });
    return { geometry: geo, material: mat };
  }, [bottomRadius, topRadius, height, opacity]);

  useFrame(() => {
    const grow = sceneState.intro.cone;
    if (!mesh.current) return;
    mesh.current.visible = grow > 0;
    mesh.current.scale.y = Math.max(0.0001, grow);
  });

  return <mesh ref={mesh} name="light-cone" geometry={geometry} material={material} renderOrder={2} />;
};

export default LightCone;
