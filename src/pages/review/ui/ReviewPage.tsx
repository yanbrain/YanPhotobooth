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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-gradient-to-br from-red-900/50 to-purple-900/50 border-2 border-red-500 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {errorMapping.title}
          </h2>
          <p className="text-white text-lg mb-8 text-center">{errorMapping.message}</p>
          <div className="flex gap-4">
            {errorMapping.canRetry && (
              <Button onClick={handleBack} variant="primary" className="flex-1">
                Try Again
              </Button>
            )}
            <Button onClick={() => router.push('/capture')} variant="outline" className="flex-1">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-8">
        <Button onClick={handleBack} variant="outline" size="sm">
          ← Back
        </Button>
        <h1 className="text-4xl font-bold text-white uppercase tracking-wider">
          AI Photobooth
        </h1>
        <div className="w-32" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-4xl">
          {/* Neon portal frame */}
          <div className="absolute -inset-8 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-3xl opacity-20 blur-xl" />
          <div className="absolute -inset-4 border-4 border-neon-cyan rounded-2xl shadow-2xl shadow-neon-cyan/50 animate-pulse" />

          {/* Generated image */}
          <div className="relative aspect-video rounded-xl overflow-hidden">
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

      {/* Bottom actions */}
      <div className="flex justify-center gap-8 p-8">
        <Button onClick={handlePrint} variant="primary" size="lg" className="min-w-64">
          Print
        </Button>
        <Button onClick={handleEmailClick} variant="secondary" size="lg" className="min-w-64">
          Email
        </Button>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        isSending={emailStatus === 'sending'}
      />
    </div>
  );
}
