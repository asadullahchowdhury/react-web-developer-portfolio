/**
 * Hologram shader (spec §8 #5, §8.1).
 *
 * The silhouette comes from a single texture (`uMask`): alpha × luminance sets
 * where scanlines draw, so swapping the placeholder SVG for a transparent
 * portrait PNG needs no other change.
 *
 *  - horizontal 1px scanlines every `uLinePitch` CSS px
 *  - rim: outline found by sampling the mask's alpha around each pixel
 *  - the portrait is a tinted image modulated by the lines, plus thin strokes
 *    on luminance edges (glasses, beard, hairline) so the face reads
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
    vec4 mr = texture2D(uMask, vUv + vec2(uEdge, 0.0));
    vec4 ml = texture2D(uMask, vUv - vec2(uEdge, 0.0));
    vec4 mu = texture2D(uMask, vUv + vec2(0.0, uEdge));
    vec4 md = texture2D(uMask, vUv - vec2(0.0, uEdge));
    float n = min(min(mr.a, ml.a), min(mu.a, md.a));
    float edge = clamp(m.a - n, 0.0, 1.0);

    // Inner detail: luminance edges (sunglasses, beard, hairline, collar) drawn
    // as thin bright strokes, so the face reads even when it is small
    vec3 W = vec3(0.299, 0.587, 0.114);
    vec2 grad = vec2(dot(mr.rgb, W) - dot(ml.rgb, W), dot(mu.rgb, W) - dot(md.rgb, W));
    float detail = smoothstep(0.08, 0.32, length(grad)) * n;

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

    // The portrait itself is drawn as a tinted image; scanlines modulate it
    // (62% between lines, 100% on them) instead of being the only signal, so
    // the face stays recognisable (owner request)
    float image = body * mix(0.62, 1.0, line);
    float alpha = (image + detail * 0.55 + edge) * fade * revealed * uOpacity * uFlicker;
    alpha += scanLine * 0.9;

    vec3 color = mix(uColor, uRim, clamp(edge + detail * 0.6 + scanLine, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;
