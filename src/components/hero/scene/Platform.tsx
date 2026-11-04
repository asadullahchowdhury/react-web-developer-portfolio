import { useMemo } from 'react';
import { AdditiveBlending, Color, Line, LineBasicMaterial, ShaderMaterial } from 'three';
import { COLORS, WORLD } from './config';
import { ellipsePoints } from './geometry';

const padVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Radial light falloff, `uOpacity` at the centre → 0 at the rim. */
const padFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = clamp(length(vUv - 0.5) * 2.0, 0.0, 1.0);
    float a = uOpacity * pow(1.0 - d, 2.0);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

/** Floor rings and the pad glow under the hologram (spec §8 #1–3). */
const Platform = () => {
  const { rings, pad } = WORLD;

  const { outer, inner, padMaterial } = useMemo(() => {
    const outerLine = new Line(
      ellipsePoints(rings.outerRadius, rings.outerRadius, rings.segments),
      new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: rings.outerOpacity, depthWrite: false }),
    );
    const innerLine = new Line(
      ellipsePoints(rings.innerRadius, rings.innerRadius, rings.segments),
      new LineBasicMaterial({ color: COLORS.signal, transparent: true, opacity: rings.innerOpacity, depthWrite: false }),
    );
    outerLine.name = 'ring-outer';
    innerLine.name = 'ring-inner';

    const glow = new ShaderMaterial({
      vertexShader: padVertex,
      fragmentShader: padFragment,
      uniforms: {
        uColor: { value: new Color(COLORS.signal) },
        uOpacity: { value: pad.opacity },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    return { outer: outerLine, inner: innerLine, padMaterial: glow };
  }, [rings, pad]);

  return (
    <group name="platform">
      <primitive object={outer} />
      <primitive object={inner} />
      <mesh name="pad-glow" rotation-x={-Math.PI / 2} position-y={0.002} material={padMaterial} renderOrder={1}>
        <circleGeometry args={[pad.radius, 64]} />
      </mesh>
    </group>
  );
};

export default Platform;
