'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Modal } from './Modal';
import { Button } from './Button';

interface IdleTimeoutProps {
  /** Timeout in milliseconds (default: 60 seconds) */
  timeout?: number;
  /** Warning time before timeout in milliseconds (default: 15 seconds) */
  warningTime?: number;
  /** Callback when session times out */
  onTimeout?: () => void;
}

export function IdleTimeout({
  timeout = 60000, // 60 seconds
  warningTime = 15000, // 15 seconds
  onTimeout,
}: IdleTimeoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const resetSession = useCallback(() => {
    // Don't reset on capture page (home)
    if (pathname === '/capture' || pathname === '/') {
      return;
    }

    router.push('/capture');
    if (onTimeout) {
      onTimeout();
    }
  }, [router, pathname, onTimeout]);

  const handleContinue = useCallback(() => {
    setShowWarning(false);
    setCountdown(0);
  }, []);

  useEffect(() => {
    // Don't run on capture page
    if (pathname === '/capture' || pathname === '/') {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let warningTimeoutId: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setCountdown(0);

      // Set warning timer
      warningTimeoutId = setTimeout(() => {
        setShowWarning(true);
        setCountdown(Math.floor(warningTime / 1000));

        // Start countdown
        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, timeout - warningTime);

      // Set timeout timer
      timeoutId = setTimeout(() => {
        resetSession();
      }, timeout);
    };

    // Events that reset the timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });

    // Start initial timer
    resetTimers();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(countdownInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
    };
  }, [pathname, timeout, warningTime, resetSession]);

  return (
    <Modal
      isOpen={showWarning}
      onClose={handleContinue}
      title="Are you still there?"
    >
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="text-6xl animate-pulse-neon">⏱️</div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-white text-lg font-mono">
            Your session will reset in <span className="text-neon-cyan font-cyber font-bold text-2xl">{countdown}</span> seconds due to inactivity
          </p>

          <p className="text-neon-cyan/60 text-sm font-mono">
            Touch anywhere to continue your session
          </p>
        </div>

        {/* Countdown progress bar */}
        <div className="w-full h-2 bg-cyber-dark/60 rounded-full border border-neon-cyan/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan to-cyber-pink transition-all duration-1000 ease-linear"
            style={{
              width: `${(countdown / (warningTime / 1000)) * 100}%`,
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button onClick={handleContinue} variant="primary" className="flex-1">
            <span className="flex items-center justify-center gap-2">
              <span>✓</span>
              Continue Session
            </span>
          </Button>

          <Button onClick={resetSession} variant="ghost" className="flex-1">
            Start Over
          </Button>
        </div>
      </div>
    </Modal>
  );
}
