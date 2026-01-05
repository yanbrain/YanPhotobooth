'use client';

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

export function Toast({ id, type, message, duration = 5000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'warning':
        return '⚡';
      case 'info':
        return 'ℹ';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'border-neon-green text-neon-green';
      case 'error':
        return 'border-cyber-pink text-cyber-pink';
      case 'warning':
        return 'border-cyber-yellow text-cyber-yellow';
      case 'info':
        return 'border-neon-cyan text-neon-cyan';
    }
  };

  const getShadow = () => {
    switch (type) {
      case 'success':
        return 'shadow-[0_0_20px_rgba(0,255,159,0.4)]';
      case 'error':
        return 'shadow-[0_0_20px_rgba(255,0,110,0.4)]';
      case 'warning':
        return 'shadow-[0_0_20px_rgba(255,190,11,0.4)]';
      case 'info':
        return 'shadow-[0_0_20px_rgba(0,240,255,0.4)]';
    }
  };

  return (
    <div
      className={`
        relative glass-card rounded-xl border-2 ${getColors()} ${getShadow()}
        p-4 pr-12 min-w-80 max-w-md
        animate-[slideIn_0.3s_ease-out]
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-5 rounded-xl pointer-events-none" />

      {/* Content */}
      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className={`text-2xl animate-pulse-neon`}>
          {getIcon()}
        </div>

        {/* Message */}
        <p className="flex-1 text-white text-sm font-mono leading-relaxed pt-1">
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={() => onDismiss(id)}
          className={`
            absolute -top-2 -right-2 w-8 h-8 rounded-lg
            bg-cyber-dark border-2 ${getColors()}
            flex items-center justify-center
            hover:scale-110 transition-transform duration-200
            group
          `}
          aria-label="Dismiss notification"
        >
          <span className="text-sm font-bold group-hover:rotate-90 transition-transform duration-300">
            ×
          </span>
        </button>
      </div>

      {/* Corner brackets */}
      <div className={`absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 ${getColors()} opacity-60`} />
      <div className={`absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 ${getColors()} opacity-60`} />

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyber-dark/50 rounded-b-xl overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${
              type === 'success' ? 'from-neon-green to-neon-cyan' :
              type === 'error' ? 'from-cyber-pink to-cyber-purple' :
              type === 'warning' ? 'from-cyber-yellow to-cyber-pink' :
              'from-neon-cyan to-neon-purple'
            }`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
