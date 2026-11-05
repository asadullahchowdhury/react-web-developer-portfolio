/**
 * Hologram shader (spec §8 #5, §8.1).
 *
 * The silhouette comes from a single texture (`uMask`): alpha × luminance sets
 * where scanlines draw, so swapping the placeholder SVG for a transparent
 * portrait PNG needs no other change.
 *
 *  - horizontal 1px scanlines every `uLinePitch` CSS px
 *  - rim: outline found by sampling the mask's alpha around each pixel
 *  - faint fill between the lines (brighter areas only) so the face reads
 *  - vertical fade: 45% at the very top → 100% at 12% down
 *  - `uReveal` 0 → 1 scans the figure in from the top, with a bright front line
 *  - `uFlicker` multiplies the whole result (kept within 3% by the animation)
 */

export const hologramVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const hologramFragment = /* glsl */ `
  uniform sampler2D uMask;
  uniform vec3 uColor;
  uniform vec3 uRim;
  uniform float uOpacity;
  uniform float uReveal;
  uniform float uFlicker;
  uniform float uLinePitch;
  uniform float uPixelRatio;
  uniform float uEdge;
  varying vec2 vUv;

  void main() {
    vec4 m = texture2D(uMask, vUv);
    float luma = dot(m.rgb, vec3(0.299, 0.587, 0.114));
    // Luminance stretched so skin reads clearly brighter than hair, shirt and
    // sunglasses (the face needs that contrast to be recognisable); floor of
    // 22% so dark clothing still reads as part of the figure
    float body = m.a * mix(0.22, 1.0, smoothstep(0.04, 0.62, luma));

    // Rim: alpha drop to any neighbour within uEdge
    float n = min(
      min(texture2D(uMask, vUv + vec2(uEdge, 0.0)).a, texture2D(uMask, vUv - vec2(uEdge, 0.0)).a),
      min(texture2D(uMask, vUv + vec2(0.0, uEdge)).a, texture2D(uMask, vUv - vec2(0.0, uEdge)).a)
    );
    float edge = clamp(m.a - n, 0.0, 1.0);

    // Thin horizontal scanlines at a fixed screen pitch (crisp at any stage size)
    float pitch = uLinePitch * uPixelRatio;
    float s = mod(gl_FragCoord.y, pitch);
    float line = 1.0 - smoothstep(uPixelRatio * 0.6, uPixelRatio * 1.4, s);

    // Soft top edge only: 45% at the very top, full strength from 12% down,
    // so the head (top quarter of the portrait) stays at near-full strength
    float fade = mix(0.45, 1.0, smoothstep(1.0, 0.88, vUv.y));

    // Scan-in from the top
    float front = 1.0 - uReveal;
    float revealed = smoothstep(front - 0.004, front + 0.004, vUv.y);
    float scanning = step(0.001, uReveal) * step(uReveal, 0.999);
    float scanLine = (1.0 - smoothstep(0.0, 0.012, abs(vUv.y - front))) * scanning * m.a;

    // Faint continuous fill between the lines carries the facial detail
    float fill = body * body * 0.32;
    float alpha = (body * line * 0.9 + fill + edge) * fade * revealed * uOpacity * uFlicker;
    alpha += scanLine * 0.9;

    vec3 color = mix(uColor, uRim, clamp(edge + scanLine, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;
