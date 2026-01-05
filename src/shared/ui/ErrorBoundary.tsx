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
          <div className="fixed inset-0 bg-cyber-darker">
            <div className="absolute inset-0 cyber-grid opacity-15" />
          </div>

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-lg w-full glass-card rounded-none border border-cyber-pink p-8 md:p-10">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <div className="relative text-center mb-6">
                <div className="text-6xl">💥</div>
              </div>

              <h2 className="relative text-2xl md:text-3xl font-cyber font-semibold text-cyber-pink neon-text mb-4 text-center uppercase tracking-[0.2em]">
                System Error
              </h2>

              <div className="relative mb-6">
                <p className="text-neon-cyan/80 text-base md:text-lg mb-4 text-center font-mono">
                  Something went wrong. The application encountered an unexpected error.
                </p>

                {this.state.error && (
                  <details className="mt-4 glass-card rounded-none border border-cyber-pink/30 p-4">
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

              <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-cyber-pink" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-cyber-pink" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-cyber-pink" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-cyber-pink" />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
