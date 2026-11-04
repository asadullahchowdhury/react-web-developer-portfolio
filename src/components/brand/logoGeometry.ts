/**
 * RC bracket monogram — the single source of the logo geometry, shared by
 * the <Logo> component and the icon generator.
 *
 * viewBox 0 0 120 100, fill none, miter joins, butt caps.
 */

export const LOGO_VIEWBOX = { width: 120, height: 100 } as const;

export const LOGO_COLORS = {
  ink: '#EDEFF3', // --text-primary
  signal: '#9CC9FF', // --signal
  void: '#07090D', // --bg-void
} as const;

export const LOGO_PATHS = {
  /** R bowl + stem */
  rBowl: 'M18 84 V21 H44 A16 16 0 0 1 44 53 H18',
  /** R leg */
  rLeg: 'M34 53 L56 84',
  /** C drawn as a bracket */
  bracket: 'M106 21 H80 L62 52.5 L80 84 H106',
} as const;

/**
 * Stroke width (in viewBox units) for a mark rendered `height` CSS px tall:
 * 12 at 28 px and up, 13 below (24 px). Icons use their own weights:
 * 15 for the 32 px icon, 18 for the 16–24 px favicon.
 */
export const strokeForHeight = (height: number) => (height >= 28 ? 12 : 13);

export const ICON_STROKE = { favicon: 18, icon32: 15, large: 12 } as const;

/** Standalone SVG of the mark centred on a #07090D square (used for icons). */
export function iconSvg({
  size,
  stroke,
  radius,
  padding = 0.18,
}: {
  size: number;
  stroke: number;
  /** Corner radius as a fraction of the size (0 = square corners). */
  radius: number;
  padding?: number;
}): string {
  const inner = size * (1 - padding * 2);
  const scale = inner / LOGO_VIEWBOX.width;
  const x = (size - LOGO_VIEWBOX.width * scale) / 2;
  const y = (size - LOGO_VIEWBOX.height * scale) / 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" rx="${size * radius}" fill="${LOGO_COLORS.void}"/>`,
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke-linejoin="miter" stroke-linecap="butt" stroke-width="${stroke}">`,
    `<path d="${LOGO_PATHS.rBowl}" stroke="${LOGO_COLORS.ink}"/>`,
    `<path d="${LOGO_PATHS.rLeg}" stroke="${LOGO_COLORS.ink}"/>`,
    `<path d="${LOGO_PATHS.bracket}" stroke="${LOGO_COLORS.signal}"/>`,
    `</g></svg>`,
  ].join('');
}
