import { LOGO_COLORS, LOGO_PATHS, LOGO_VIEWBOX, strokeForHeight } from './logoGeometry';

export type LogoVariant = 'full' | 'short' | 'mark';

interface LogoProps {
  /** full = mark + "Rahat Chowdhury" · short = mark + "Rahat" · mark = icon only */
  variant?: LogoVariant;
  /** Mark height in CSS px. */
  size?: number;
  /** Draw the strokes in on mount (R first, then the bracket, ~600 ms). */
  animate?: boolean;
  className?: string;
}

/**
 * RC bracket monogram + wordmark. The mark is decorative (aria-hidden); the
 * wordmark is real text. When the logo is used alone inside a link, give the
 * link an aria-label.
 *
 * Draw-in uses pathLength = 1 so the dash maths is size-independent; it is
 * disabled under prefers-reduced-motion (index.css).
 */
const Logo = ({ variant = 'full', size = 28, animate = false, className = '' }: LogoProps) => {
  const width = (size * LOGO_VIEWBOX.width) / LOGO_VIEWBOX.height;
  const stroke = strokeForHeight(size);

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        aria-hidden="true"
        width={width}
        height={size}
        viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
        fill="none"
        strokeLinejoin="miter"
        strokeLinecap="butt"
        strokeWidth={stroke}
        className={`shrink-0 ${animate ? 'logo-draw' : ''}`}
      >
        <path d={LOGO_PATHS.rBowl} stroke={LOGO_COLORS.ink} pathLength={1} data-stroke="r-bowl" />
        <path d={LOGO_PATHS.rLeg} stroke={LOGO_COLORS.ink} pathLength={1} data-stroke="r-leg" />
        <path d={LOGO_PATHS.bracket} stroke={LOGO_COLORS.signal} pathLength={1} data-stroke="bracket" />
      </svg>

      {variant !== 'mark' && (
        <span className="whitespace-nowrap text-[16px] leading-none tracking-[-0.015em] text-ink-primary">
          <span className="font-bold">Rahat</span>
          {variant === 'full' && <span className="font-light"> Chowdhury</span>}
        </span>
      )}
    </span>
  );
};

export default Logo;
