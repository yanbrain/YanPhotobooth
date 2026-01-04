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
  const action = searchParams.get('action');

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex flex-col items-center justify-center p-8">
      {/* Success animation */}
      <div className="mb-12">
        <div className="w-32 h-32 rounded-full border-8 border-neon-cyan flex items-center justify-center animate-pulse">
          <span className="text-6xl">✓</span>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-6xl font-bold text-neon-cyan mb-4 uppercase tracking-wider">
        {message}
      </h1>

      <p className="text-white text-xl mb-12 text-center max-w-md">
        {action === 'email'
          ? 'Check your inbox for your amazing AI portrait!'
          : action === 'print'
          ? 'Your portrait is ready to print!'
          : 'Your AI portrait has been created!'}
      </p>

      {/* Start Over button */}
      <Button onClick={handleStartOver} variant="primary" size="lg">
        Start Over
      </Button>
    </div>
  );
}
