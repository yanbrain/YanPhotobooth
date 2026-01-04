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
    // Reset all stores
    clearCapture();
    clearSelection();
    resetGeneration();
    resetEmail();

    // Navigate back to capture
    router.push('/capture');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-10" />

        {/* Multiple animated gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-neon-pink/30 to-neon-blue/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 md:p-8">
        {/* Success animation container */}
        <div className="mb-12 relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-40 h-40 md:w-48 md:h-48 border-4 border-neon-cyan/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />

          {/* Middle pulsing ring */}
          <div className="absolute inset-3 md:inset-4 border-4 border-neon-purple rounded-full animate-pulse-neon" />

          {/* Inner success circle */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-neon-cyan flex items-center justify-center shadow-neon-cyan animate-pulse-neon">
            {/* Checkmark */}
            <span className="text-7xl md:text-8xl drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">
              {action === 'email' ? '📧' : action === 'print' ? '🖨️' : '✓'}
            </span>

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-neon-cyan" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-neon-cyan" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-neon-cyan" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-neon-cyan" />
          </div>
        </div>

        {/* Success message */}
        <div className="text-center mb-12 space-y-4">
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-cyber font-bold text-neon-cyan neon-text uppercase tracking-wider mb-4">
            {message}
          </h1>

          {/* Subtitle message */}
          <div className="glass-card px-8 py-4 rounded-2xl border-2 border-neon-cyan/40 max-w-2xl mx-auto">
            <p className="text-white text-lg md:text-xl font-mono">
              {action === 'email'
                ? 'Check your inbox for your amazing AI portrait!'
                : action === 'print'
                ? 'Your portrait is ready to print!'
                : 'Your AI portrait has been created!'}
            </p>
          </div>

          {/* Additional details */}
          {action === 'email' && (
            <p className="text-neon-cyan/60 text-sm font-mono mt-4">
              Your masterpiece will arrive within minutes
            </p>
          )}
          {action === 'print' && (
            <p className="text-neon-cyan/60 text-sm font-mono mt-4">
              Print dialog should have opened in a new window
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={handleStartOver}
            variant="primary"
            size="lg"
            className="min-w-80 py-6 text-xl"
          >
            <span className="flex items-center gap-3">
              <span>🎨</span>
              <span>Create Another Portrait</span>
            </span>
          </Button>

          <p className="text-neon-cyan/50 text-sm font-mono">
            Ready to create another masterpiece?
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 glass-card px-4 py-2 rounded-lg border border-neon-cyan/30 hidden md:block">
          <p className="text-neon-cyan text-xs font-mono uppercase tracking-wider">Session Complete</p>
        </div>

        <div className="absolute top-8 right-8 glass-card px-4 py-2 rounded-lg border border-neon-green/30 hidden md:block">
          <p className="text-neon-green text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Success
          </p>
        </div>
      </div>
    </div>
  );
}
