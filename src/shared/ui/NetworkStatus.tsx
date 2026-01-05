'use client';

import React, { useEffect, useState } from 'react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showOffline) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        transition-all duration-500
        ${showOffline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`
          glass-card rounded-none border px-6 py-4
          ${
            isOnline
              ? 'border-neon-green shadow-[0_0_12px_rgba(57,255,176,0.35)]'
              : 'border-cyber-pink shadow-[0_0_12px_rgba(255,79,122,0.35)]'
          }
        `}
      >
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <div
            className={`
              w-3 h-3 rounded-sm
              ${isOnline ? 'bg-neon-green animate-pulse' : 'bg-cyber-pink'}
            `}
          />

          <p
            className={`
              font-cyber font-semibold text-sm uppercase tracking-[0.2em]
              ${isOnline ? 'text-neon-green' : 'text-cyber-pink'}
            `}
          >
            {isOnline ? (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Connection Restored
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>⚠</span>
                No Internet Connection
              </span>
            )}
          </p>
        </div>

        <div
          className={`absolute top-1 left-1 w-4 h-4 border-t border-l ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
        <div
          className={`absolute top-1 right-1 w-4 h-4 border-t border-r ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
        <div
          className={`absolute bottom-1 left-1 w-4 h-4 border-b border-l ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
        <div
          className={`absolute bottom-1 right-1 w-4 h-4 border-b border-r ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
      </div>
    </div>
  );
}
