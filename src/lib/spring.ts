/**
 * Critically damped spring, solved analytically so it is frame-rate
 * independent and can never overshoot (spec §10).
 *
 * ω = √stiffness. Spec §10 asks for stiffness ≈ 120, damping ≈ 20 with
 * "no overshoot"; damping 20 is just under critical (2√120 ≈ 21.9), so the
 * critically damped form at the same stiffness is used instead.
 */
export interface SpringState {
  x: number;
  v: number;
}

export const SPRING_OMEGA = Math.sqrt(120);
/** Slower return when the pointer leaves the window: settles in ~0.8 s. */
export const SPRING_OMEGA_RELEASE = 7.5;

export function springStep(s: SpringState, target: number, omega: number, dt: number): void {
  const x0 = s.x - target;
  const decay = Math.exp(-omega * dt);
  const t = (s.v + omega * x0) * dt;
  s.x = target + (x0 + t) * decay;
  s.v = (s.v - omega * t) * decay;
}

export const springSettled = (s: SpringState, target: number) =>
  Math.abs(s.x - target) < 1e-4 && Math.abs(s.v) < 1e-4;
