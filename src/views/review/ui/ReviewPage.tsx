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

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 md:py-10">
          <div className="w-full max-w-3xl">
            <div className="relative glass-card rounded-none border border-cyber-pink/70 shadow-glass">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <div className="relative flex flex-col items-center justify-center px-8 py-12 gap-6 min-h-[60vh]">
                <div className="text-6xl">⚠️</div>

                <h2 className="text-2xl md:text-3xl font-cyber font-semibold text-cyber-pink neon-text text-center uppercase tracking-[0.2em]">
                  {errorMapping.title}
                </h2>

                <p className="text-neon-cyan/80 text-base md:text-lg text-center font-mono max-w-xl">
                  {errorMapping.message}
                </p>

                <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
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

              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyber-pink/70" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyber-pink/70" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyber-pink/70" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyber-pink/70" />
            </div>
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 md:py-10">
        <div className="w-full max-w-6xl">
          <div className="relative glass-card rounded-none border border-neon-cyan/40 shadow-glass">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative flex flex-col min-h-[80vh]">
              <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-neon-cyan/20 bg-cyber-dark/70 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button onClick={handleBack} variant="ghost" size="sm">
                    ← Back
                  </Button>
                </div>

                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.3em] mb-1">
                    AI Photobooth
                  </h1>
                  <p className="text-neon-cyan/50 text-xs font-mono uppercase tracking-[0.4em]">
                    Step 3 / 3
                  </p>
                </div>

                <div className="flex items-center justify-end text-neon-cyan/60 text-xs font-mono uppercase tracking-[0.3em]">
                  Output Review
                </div>
              </header>

              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
                <div className="relative w-full max-w-5xl">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 glass-card px-8 py-3 rounded-none border border-neon-green">
                    <p className="text-neon-green text-base font-cyber font-semibold uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      Portrait Generated Successfully
                    </p>
                  </div>

                  <div className="relative aspect-video min-h-[420px]">
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

                <div className="flex flex-col items-center gap-6 w-full">
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
            </div>

            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-neon-cyan/70" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-neon-cyan/70" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-neon-cyan/70" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-neon-cyan/70" />
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
