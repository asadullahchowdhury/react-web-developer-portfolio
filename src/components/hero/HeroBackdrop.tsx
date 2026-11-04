/**
 * Static key-light glow, upper right of the hero (spec §3.1, §6).
 * The only decorative gradient allowed: light falloff.
 */
const HeroBackdrop = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      data-key-light
      className="absolute right-[-6%] top-[-10%] h-[80%] w-[62%]"
      style={{
        background:
          'radial-gradient(ellipse at center, rgb(var(--signal-rgb) / 0.08) 0%, transparent 70%)',
      }}
    />
  </div>
);

export default HeroBackdrop;
