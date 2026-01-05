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
      <div className="relative min-h-[100svh] overflow-hidden">
        <div className="fixed inset-0 bg-cyber-darker">
          <div className="absolute inset-0 cyber-grid opacity-15" />
        </div>

        <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4">
          <div className="w-full max-w-3xl">
            <div className="relative glass-card rounded-none border border-cyber-pink/70 shadow-glass">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <div className="relative flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-10 gap-5 sm:gap-6 min-h-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-cyber font-semibold text-cyber-pink neon-text text-center uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  {errorMapping.title}
                </h2>

                <p className="text-neon-cyan/80 text-sm sm:text-base md:text-lg text-center font-mono max-w-xl">
                  {errorMapping.message}
                </p>

                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full max-w-md">
                  {errorMapping.canRetry && (
                    <Button onClick={handleBack} variant="primary" className="flex-1">
                      Try Again
                    </Button>
                  )}
                  <Button onClick={() => router.push('/capture')} variant="ghost" className="flex-1">
                    Start Over
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <div className="fixed inset-0 bg-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-15" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4">
        <div className="w-full max-w-6xl">
          <div className="relative glass-card rounded-none border border-neon-cyan/40 shadow-glass">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative flex flex-col h-full min-h-0">
              <header className="flex flex-col gap-3 border-b border-neon-cyan/20 bg-cyber-dark/70 px-4 sm:px-6 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Button onClick={handleBack} variant="ghost" size="sm" className="w-full md:w-auto">
                    Back
                  </Button>
                </div>

                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1">
                    AI Photobooth
                  </h1>
                  <p className="text-neon-cyan/50 text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] sm:tracking-[0.4em]">
                    Review Output
                  </p>
                </div>

                <div className="hidden md:block" />
              </header>

              <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-6 gap-5 sm:gap-6 min-h-0">
                <div className="relative w-full max-w-5xl">
                  <div className="relative aspect-video max-h-[48vh] sm:max-h-[52vh] lg:max-h-[58vh]">
                    <div className="relative h-full glass-card rounded-none border border-neon-cyan/60 overflow-hidden">
                      {resultUrl && (
                        <img
                          src={resultUrl}
                          alt="Generated portrait"
                          className="w-full h-full object-cover"
                        />
                      )}

                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">
                  <div className="flex flex-col md:flex-row justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl">
                    <Button
                      onClick={handlePrint}
                      variant="primary"
                      size="lg"
                      className="flex-1 py-4 sm:py-5 text-base sm:text-lg"
                    >
                      Print Photo
                    </Button>
                    <Button
                      onClick={handleEmailClick}
                      variant="primary"
                      size="lg"
                      className="flex-1 py-4 sm:py-5 text-base sm:text-lg"
                    >
                      Email Photo
                    </Button>
                  </div>

                  <p className="text-neon-cyan/60 text-sm font-mono text-center">
                    Choose how you'd like to receive your AI-generated masterpiece
                  </p>
                </div>
              </div>
            </div>

          </div>
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
