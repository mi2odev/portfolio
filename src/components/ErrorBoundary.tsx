import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Called when the user asks to recover, so the host can reset state (e.g. fall back to V1). */
  onReset?: () => void;
}
interface State {
  error: Error | null;
}

const wrap: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 28,
  background: '#05050b',
  color: '#EAF0FF',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  textAlign: 'center',
};

/**
 * Catches render-time crashes in a version so a single broken design never
 * leaves the visitor staring at a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio render error:', error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={wrap} role="alert">
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: '#C6F24E' }}>
            Something broke
          </p>
          <h1 style={{ margin: '14px 0 10px', fontSize: 22, fontWeight: 700 }}>
            This view failed to render.
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(234,240,255,0.66)' }}>
            The rest of the portfolio still works — reload, or jump back to the first design.
          </p>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginTop: 22,
              padding: '11px 22px',
              borderRadius: 999,
              border: '1px solid rgba(198,242,78,0.6)',
              background: 'transparent',
              color: '#C6F24E',
              font: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Back to V1
          </button>
        </div>
      </div>
    );
  }
}
