import { Component, type ReactNode } from 'react';

interface Props {
  onError: () => void;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Catches a failed chunk load or WebGL renderer creation and falls back to
 * the static poster, so the 3D scene can never break the hero (spec §13).
 */
class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn('[hero] 3D scene disabled:', error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default SceneErrorBoundary;
