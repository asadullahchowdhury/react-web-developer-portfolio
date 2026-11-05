import { useState } from 'react';

interface RollingNumberProps {
  value: string;
  className?: string;
}

/**
 * Counter digits that roll vertically when the value changes (POLISH P2-13):
 * the new value rises in from below while the old one leaves upward (reversed
 * when the value goes down), 200 ms ease-lab. Reduced motion: plain swap.
 */
const RollingNumber = ({ value, className = '' }: RollingNumberProps) => {
  const [state, setState] = useState({ current: value, previous: null as string | null, dir: 1 });

  // Derived state: react to a new value during render (no extra effect pass)
  if (value !== state.current) {
    setState({ current: value, previous: state.current, dir: value > state.current ? 1 : -1 });
  }

  return (
    <span
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
      style={{ ['--roll-dir' as string]: state.dir }}
    >
      {state.previous !== null && (
        <span
          key={`out-${state.previous}`}
          aria-hidden="true"
          className="roll-out [grid-area:1/1]"
          onAnimationEnd={() => setState((s) => ({ ...s, previous: null }))}
        >
          {state.previous}
        </span>
      )}
      <span key={`in-${state.current}`} className={`[grid-area:1/1] ${state.previous !== null ? 'roll-in' : ''}`}>
        {state.current}
      </span>
    </span>
  );
};

export default RollingNumber;
