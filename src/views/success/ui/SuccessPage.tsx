'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { useCaptureStore } from '@/features/capture-photo/model/capture-store';
import { useSelectStyleStore } from '@/features/select-style/model/select-style-store';
import { useGenerationStore } from '@/features/generate-portrait/model/generation-store';
import { useSendEmailStore } from '@/features/send-email/model/send-email-store';

export function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams?.get('action');

  const { clearCapture } = useCaptureStore();
  const { clearSelection } = useSelectStyleStore();
  const { reset: resetGeneration } = useGenerationStore();
  const { reset: resetEmail } = useSendEmailStore();

  const message =
    action === 'email'
      ? 'Email Sent!'
      : action === 'print'
      ? 'Ready to Print!'
      : 'Success!';

  const handleStartOver = () => {
    clearCapture();
    clearSelection();
    resetGeneration();
    resetEmail();

    router.push('/capture');
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div className="fixed inset-0 bg-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-15" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4">
        <div className="w-full max-w-5xl">
          <div className="relative glass-card rounded-none border border-neon-cyan/40 shadow-glass">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-10 gap-6 sm:gap-8 min-h-0">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3">
                  {message}
                </h1>
                <p className="text-neon-cyan/50 text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] sm:tracking-[0.4em]">
                  Session Complete
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border border-neon-cyan/30 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-2 sm:inset-3 md:inset-4 border border-neon-purple" />
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-2 border-neon-cyan flex items-center justify-center shadow-neon-cyan">
                  <span className="text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">
                    {action === 'email' ? '📧' : action === 'print' ? '🖨️' : '✓'}
                  </span>

                  <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-neon-cyan" />
                  <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-neon-cyan" />
                  <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-neon-cyan" />
                  <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-neon-cyan" />
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="glass-card px-8 py-4 rounded-none border border-neon-cyan/40 max-w-2xl mx-auto">
                  <p className="text-white text-base sm:text-lg md:text-xl font-mono">
                    {action === 'email'
                      ? 'Check your inbox for your amazing AI portrait!'
                      : action === 'print'
                      ? 'Your portrait is ready to print!'
                      : 'Your AI portrait has been created!'}
                  </p>
                </div>

                {action === 'email' && (
                  <p className="text-neon-cyan/60 text-xs sm:text-sm font-mono mt-4">
                    Your masterpiece will arrive within minutes
                  </p>
                )}
                {action === 'print' && (
                  <p className="text-neon-cyan/60 text-xs sm:text-sm font-mono mt-4">
                    Print dialog should have opened in a new window
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-6">
                <Button
                  onClick={handleStartOver}
                  variant="primary"
                  size="lg"
                  className="w-full sm:min-w-80 sm:w-auto py-4 sm:py-6 text-base sm:text-xl"
                >
                  <span className="flex items-center gap-3">
                    <span>🎨</span>
                    <span>Create Another Portrait</span>
                  </span>
                </Button>

                <p className="text-neon-cyan/50 text-xs sm:text-sm font-mono">
                  Ready to create another masterpiece?
                </p>
              </div>

              <div className="absolute top-6 left-6 glass-card px-4 py-2 rounded-none border border-neon-cyan/30 hidden md:block">
                <p className="text-neon-cyan text-xs font-mono uppercase tracking-[0.2em]">
                  Status: Archived
                </p>
              </div>

              <div className="absolute top-6 right-6 glass-card px-4 py-2 rounded-none border border-neon-green/30 hidden md:block">
                <p className="text-neon-green text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-neon-green animate-pulse" />
                  Success
                </p>
              </div>
            </div>

            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-neon-cyan/70" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-neon-cyan/70" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-neon-cyan/70" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-neon-cyan/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
