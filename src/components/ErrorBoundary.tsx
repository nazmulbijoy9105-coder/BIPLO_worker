import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 border-4 border-black m-2">
          <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex items-center space-x-3 text-red-600 border-b-2 border-black pb-4">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-black">System Interruption</h2>
                <p className="text-[10px] font-mono uppercase text-red-600">Runtime Error Intercepted</p>
              </div>
            </div>

            <p className="text-xs text-black/70 leading-relaxed font-serif italic">
              BIPLOB Skills Academy platform encountered an unexpected runtime exception. This might be due to localized connection latency, missing configuration parameters, or an unhandled browser state.
            </p>

            {this.state.error && (
              <div className="bg-[#FAF9F6] border border-black/10 p-4 font-mono text-[10px] text-red-700 overflow-x-auto max-h-40">
                <span className="font-bold uppercase tracking-wider block mb-1">Error Trace:</span>
                <span className="block whitespace-pre-wrap">{this.state.error.toString()}</span>
                {this.state.errorInfo && (
                  <span className="block mt-2 text-black/50 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-black hover:bg-black/90 text-white font-bold py-3 uppercase text-xs tracking-wider flex items-center justify-center space-x-2 border-2 border-black transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={() => { window.location.href = "/"; }}
                className="flex-1 bg-white hover:bg-black/5 text-black font-bold py-3 uppercase text-xs tracking-wider flex items-center justify-center space-x-2 border-2 border-black transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
