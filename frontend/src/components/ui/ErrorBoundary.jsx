import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              We encountered an unexpected error while loading this page.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-left overflow-auto text-xs font-mono text-red-600 dark:text-red-400 mb-6 max-h-32">
                {this.state.error?.toString()}
              </div>
            )}
            <Button onClick={() => window.location.reload()} className="w-full">
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
