/**
 * Hero backdrop — ambient glow + drifting particles.
 * Tuned so color is visible on real displays (vignette + blur were cancelling it out).
 */
const BG = '#0B0F19';

/** Fixed layout — stable across renders. */
const PARTICLES: readonly {
  left: number;
  top: number;
  drift: 'a' | 'b' | 'c';
  durationSec: number;
  delaySec: number;
  sizePx: number;
  opacity: number;
}[] = [
  { left: 7, top: 62, drift: 'a', durationSec: 32, delaySec: -4, sizePx: 4, opacity: 0.22 },
  { left: 18, top: 28, drift: 'b', durationSec: 26, delaySec: -8, sizePx: 3, opacity: 0.18 },
  { left: 84, top: 22, drift: 'c', durationSec: 38, delaySec: -2, sizePx: 4, opacity: 0.24 },
  { left: 92, top: 58, drift: 'a', durationSec: 24, delaySec: -12, sizePx: 3, opacity: 0.2 },
  { left: 45, top: 88, drift: 'b', durationSec: 36, delaySec: -6, sizePx: 3, opacity: 0.16 },
  { left: 58, top: 12, drift: 'c', durationSec: 28, delaySec: -14, sizePx: 4, opacity: 0.21 },
  { left: 31, top: 48, drift: 'a', durationSec: 34, delaySec: -1, sizePx: 3, opacity: 0.22 },
  { left: 73, top: 72, drift: 'b', durationSec: 22, delaySec: -9, sizePx: 3, opacity: 0.17 },
  { left: 12, top: 85, drift: 'c', durationSec: 30, delaySec: -5, sizePx: 4, opacity: 0.2 },
  { left: 66, top: 38, drift: 'a', durationSec: 27, delaySec: -11, sizePx: 3, opacity: 0.19 },
  { left: 38, top: 76, drift: 'b', durationSec: 35, delaySec: -3, sizePx: 3, opacity: 0.16 },
  { left: 95, top: 40, drift: 'c', durationSec: 29, delaySec: -7, sizePx: 3, opacity: 0.2 },
];

const AnimatedBackground = () => (
  <div
    className="hero-animated-bg pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden"
    aria-hidden
  >
    <div className="absolute inset-0" style={{ backgroundColor: BG }} />

    {/* Static color wash (no blur) — guarantees visible depth under heavy vignette */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 85% 70% at 12% 18%, rgba(59, 130, 246, 0.22) 0%, transparent 55%),
          radial-gradient(ellipse 80% 65% at 88% 82%, rgba(99, 102, 241, 0.2) 0%, transparent 52%),
          radial-gradient(ellipse 60% 50% at 48% 55%, rgba(99, 102, 241, 0.08) 0%, transparent 45%)
        `,
      }}
    />

    {/* Animated blurred blobs — stronger cores so blur still reads */}
    <div
      className="hero-glow hero-glow-a pointer-events-none absolute -left-[22%] -top-[12%] h-[min(110vw,680px)] w-[min(110vw,680px)] rounded-full blur-[56px] sm:blur-[80px] lg:blur-[100px]"
      style={{
        background:
          'radial-gradient(circle at 38% 40%, rgba(59, 130, 246, 0.95) 0%, rgba(59, 130, 246, 0.15) 45%, transparent 68%)',
        opacity: 0.55,
      }}
    />
    <div
      className="hero-glow hero-glow-b pointer-events-none absolute -bottom-[18%] -right-[16%] h-[min(105vw,640px)] w-[min(105vw,640px)] rounded-full blur-[60px] sm:blur-[84px] lg:blur-[108px]"
      style={{
        background:
          'radial-gradient(circle at 48% 52%, rgba(99, 102, 241, 0.9) 0%, rgba(99, 102, 241, 0.12) 48%, transparent 65%)',
        opacity: 0.5,
      }}
    />
    <div
      className="hero-glow hero-glow-c pointer-events-none absolute left-[10%] top-[40%] h-[min(80vw,500px)] w-[min(90vw,560px)] rounded-full blur-[52px] sm:blur-[72px] lg:blur-[92px]"
      style={{
        background:
          'radial-gradient(circle at 50% 48%, rgba(59, 130, 246, 0.45) 0%, rgba(99, 102, 241, 0.25) 38%, transparent 64%)',
        opacity: 0.42,
      }}
    />

    {/* Light touch on edges only — don’t crush the whole canvas */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 22%, ${BG} 96%)`,
        opacity: 0.4,
      }}
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `linear-gradient(to bottom, ${BG} 0%, transparent 12%, transparent 88%, ${BG} 100%)`,
        opacity: 0.35,
      }}
    />

    <div className="pointer-events-none absolute inset-0">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`hero-particle hero-particle--${p.drift} absolute rounded-full`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.sizePx,
            height: p.sizePx,
            opacity: p.opacity,
            backgroundColor: i % 3 === 0 ? '#bfdbfe' : i % 3 === 1 ? '#c7d2fe' : '#e2e8f0',
            animationDuration: `${p.durationSec}s`,
            animationDelay: `${p.delaySec}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default AnimatedBackground;
