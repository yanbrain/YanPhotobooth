'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Modal } from './Modal';
import { Button } from './Button';

interface IdleTimeoutProps {
  timeout?: number;
  warningTime?: number;
  onTimeout?: () => void;
}

export function IdleTimeout({
  timeout = 60000,
  warningTime = 15000,
  onTimeout,
}: IdleTimeoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const resetSession = useCallback(() => {
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

      warningTimeoutId = setTimeout(() => {
        setShowWarning(true);
        setCountdown(Math.floor(warningTime / 1000));

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

      timeoutId = setTimeout(() => {
        resetSession();
      }, timeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });

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
        <div className="text-5xl">⏱️</div>

        <div className="space-y-3">
          <p className="text-white text-lg font-mono">
            Your session will reset in <span className="text-neon-cyan font-cyber font-semibold text-2xl">{countdown}</span> seconds due to inactivity
          </p>

          <p className="text-neon-cyan/60 text-sm font-mono">
            Touch anywhere to continue your session
          </p>
        </div>

        <div className="w-full h-2 bg-cyber-dark border border-neon-cyan/30 overflow-hidden">
          <div
            className="h-full bg-neon-cyan/80 transition-all duration-1000 ease-linear"
            style={{
              width: `${(countdown / (warningTime / 1000)) * 100}%`,
            }}
          />
        </div>

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
