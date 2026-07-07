import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-strong rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-alert-500/15 text-alert-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-50 mb-2">Something went wrong</h1>
            <p className="text-sm text-ink-400 mb-4">
              An unexpected error occurred. The FIFA Nexus AI team has been notified.
            </p>
            {this.state.error && (
              <pre className="text-xs text-ink-500 bg-ink-900/60 p-3 rounded-lg mb-4 overflow-auto max-h-32 text-left">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-nexus-500 hover:bg-nexus-400 text-white font-medium transition-colors"
            >
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
