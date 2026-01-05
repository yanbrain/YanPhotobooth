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
                  Create Another Portrait
                </Button>

                <p className="text-neon-cyan/50 text-xs sm:text-sm font-mono">
                  Ready to create another masterpiece?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
