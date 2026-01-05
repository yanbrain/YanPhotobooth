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

    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online
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
          glass-card rounded-2xl border-2 px-6 py-4
          ${
            isOnline
              ? 'border-neon-green shadow-[0_0_20px_rgba(0,255,159,0.4)]'
              : 'border-cyber-pink shadow-[0_0_20px_rgba(255,0,110,0.4)]'
          }
        `}
      >
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-5 rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative flex items-center gap-3">
          {/* Status indicator */}
          <div
            className={`
              w-3 h-3 rounded-full
              ${isOnline ? 'bg-neon-green animate-pulse' : 'bg-cyber-pink'}
            `}
          />

          {/* Message */}
          <p
            className={`
              font-cyber font-bold text-sm uppercase tracking-wider
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

        {/* Corner brackets */}
        <div
          className={`absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
        <div
          className={`absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
        <div
          className={`absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
        <div
          className={`absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 ${
            isOnline ? 'border-neon-green' : 'border-cyber-pink'
          }`}
        />
      </div>
    </div>
  );
}
