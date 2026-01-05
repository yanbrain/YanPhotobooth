'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerationStore } from '@/features/generate-portrait/model/generation-store';
import { useSendEmailStore } from '@/features/send-email/model/send-email-store';
import { EmailModal } from '@/features/send-email/ui/EmailModal';
import { sendEmail as sendEmailApi } from '@/features/send-email/api/send-email';
import { Button } from '@/shared/ui/Button';
import { mapError } from '@/shared/lib/map-error';

export function ReviewPage() {
  const router = useRouter();
  const { jobId, resultUrl, error: generationError } = useGenerationStore();
  const { status: emailStatus, setStatus: setEmailStatus, setError: setEmailError } =
    useSendEmailStore();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  React.useEffect(() => {
    if (!resultUrl && !generationError) {
      router.push('/capture');
    }
  }, [resultUrl, generationError, router]);

  const handlePrint = () => {
    if (resultUrl) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Photo</title>
              <style>
                body { margin: 0; padding: 0; }
                img { width: 100%; height: auto; }
                @media print {
                  body { margin: 0; }
                  img { page-break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <img src="${resultUrl}" alt="Generated portrait" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
    router.push('/success?action=print');
  };

  const handleEmailClick = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = async (email: string) => {
    if (!jobId) return;

    setEmailStatus('sending');

    try {
      await sendEmailApi(jobId, email);
      setEmailStatus('sent');
      setIsEmailModalOpen(false);
      router.push('/success?action=email');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email';
      setEmailError(message);
      setEmailStatus('failed');
    }
  };

  const handleBack = () => {
    router.push('/styles');
  };

  if (generationError) {
    const errorMapping = mapError(generationError.code);

    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-cyber-darker">
          <div className="absolute inset-0 cyber-grid opacity-15" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          <div className="max-w-lg w-full glass-card rounded-none border border-cyber-pink p-8 md:p-10">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative text-center mb-6">
              <div className="text-6xl">⚠️</div>
            </div>

            <h2 className="relative text-2xl md:text-3xl font-cyber font-semibold text-cyber-pink neon-text mb-4 text-center uppercase tracking-[0.2em]">
              {errorMapping.title}
            </h2>

            <p className="relative text-neon-cyan/80 text-base md:text-lg mb-8 text-center font-mono">
              {errorMapping.message}
            </p>

            <div className="relative flex flex-col md:flex-row gap-4">
              {errorMapping.canRetry && (
                <Button onClick={handleBack} variant="primary" className="flex-1">
                  Try Again
                </Button>
              )}
              <Button onClick={() => router.push('/capture')} variant="ghost" className="flex-1">
                Start Over
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-15" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex justify-between items-center p-6 md:p-8">
          <Button onClick={handleBack} variant="ghost" size="sm">
            ← Back
          </Button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.3em] mb-1">
              AI Photobooth
            </h1>
            <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-sm font-mono">
              <div className="w-2 h-2 bg-neon-green animate-pulse" />
              <span>STEP 3 / 3</span>
            </div>
          </div>

          <div className="w-32" />
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-5xl">
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 glass-card px-8 py-3 rounded-none border border-neon-green">
              <p className="text-neon-green text-base font-cyber font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="text-xl">✨</span>
                Portrait Generated Successfully
              </p>
            </div>

            <div className="relative aspect-video">
              <div className="relative h-full glass-card rounded-none border border-neon-cyan/60 overflow-hidden">
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-neon-cyan z-10" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-neon-cyan z-10" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-neon-cyan z-10" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-neon-cyan z-10" />

                {resultUrl && (
                  <img
                    src={resultUrl}
                    alt="Generated portrait"
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 w-full max-w-2xl">
            <Button
              onClick={handlePrint}
              variant="primary"
              size="lg"
              className="flex-1 py-5 text-lg"
            >
              <span className="flex items-center gap-2">
                <span>🖨️</span>
                Print Photo
              </span>
            </Button>
            <Button
              onClick={handleEmailClick}
              variant="primary"
              size="lg"
              className="flex-1 py-5 text-lg"
            >
              <span className="flex items-center gap-2">
                <span>📧</span>
                Email Photo
              </span>
            </Button>
          </div>

          <p className="text-neon-cyan/60 text-sm font-mono text-center">
            Choose how you'd like to receive your AI-generated masterpiece
          </p>
        </div>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        isSending={emailStatus === 'sending'}
      />
    </div>
  );
}
