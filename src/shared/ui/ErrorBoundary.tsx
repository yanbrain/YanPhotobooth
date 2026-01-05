'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (could also send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/capture';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="relative min-h-screen overflow-hidden">
          {/* Animated background */}
          <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-cyber-pink/20 to-cyber-purple/20 rounded-full blur-3xl animate-float" />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-lg w-full glass-card rounded-2xl border-2 border-cyber-pink p-8 md:p-10 shadow-neon-pink">
              {/* Cyber grid background */}
              <div className="absolute inset-0 cyber-grid opacity-5 rounded-2xl pointer-events-none" />

              {/* Error icon */}
              <div className="relative text-center mb-6">
                <div className="text-7xl animate-pulse-neon">💥</div>
              </div>

              {/* Error title */}
              <h2 className="relative text-3xl md:text-4xl font-cyber font-bold text-cyber-pink neon-text mb-4 text-center uppercase">
                System Error
              </h2>

              {/* Error message */}
              <div className="relative mb-6">
                <p className="text-neon-cyan/80 text-base md:text-lg mb-4 text-center font-mono">
                  Something went wrong. The application encountered an unexpected error.
                </p>

                {/* Error details in collapsed section */}
                {this.state.error && (
                  <details className="mt-4 glass-card rounded-lg border border-cyber-pink/30 p-4">
                    <summary className="text-neon-cyan/60 text-sm font-mono cursor-pointer hover:text-neon-cyan">
                      Technical Details
                    </summary>
                    <pre className="mt-3 text-xs text-cyber-pink/70 font-mono overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.error.stack && `\n\n${this.state.error.stack}`}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action buttons */}
              <div className="relative flex flex-col gap-3">
                <Button onClick={this.handleReset} variant="primary" className="w-full">
                  <span className="flex items-center justify-center gap-2">
                    <span>🔄</span>
                    Restart Application
                  </span>
                </Button>

                <Button
                  onClick={() => window.location.reload()}
                  variant="ghost"
                  className="w-full"
                >
                  Reload Page
                </Button>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyber-pink" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-pink" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-pink" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyber-pink" />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
