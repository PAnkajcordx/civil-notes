import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CivilNotes caught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Ignore in restricted webview
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-[#185a36] text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-black shadow-lg">
              CN
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Recoverable Session Event</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                CivilNotes Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Pearson BTEC Civil Engineering Unit Portfolios &amp; Distinction Exemplars
              </p>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 leading-relaxed text-left">
              The application encountered an unexpected browser state. Tap below to reload the portal smoothly.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-[#185a36] hover:bg-[#13492c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Portal</span>
              </button>

              <button
                onClick={this.handleReset}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                title="Clears local storage in case of corrupt state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left text-[10px] text-slate-500 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                <summary className="cursor-pointer text-slate-400 font-semibold mb-1">
                  Technical Diagnostics
                </summary>
                {this.state.error.toString()}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
