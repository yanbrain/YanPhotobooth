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
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-cyber-pink/20 to-cyber-purple/20 rounded-full blur-3xl animate-float" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          <div className="max-w-lg w-full glass-card rounded-2xl border-2 border-cyber-pink p-8 md:p-10 shadow-neon-pink">
            {/* Cyber grid background */}
            <div className="absolute inset-0 cyber-grid opacity-5 rounded-2xl pointer-events-none" />

            {/* Error icon */}
            <div className="relative text-center mb-6">
              <div className="text-7xl animate-pulse-neon">⚠️</div>
            </div>

            {/* Error title */}
            <h2 className="relative text-3xl md:text-4xl font-cyber font-bold text-cyber-pink neon-text mb-4 text-center uppercase">
              {errorMapping.title}
            </h2>

            {/* Error message */}
            <p className="relative text-neon-cyan/80 text-base md:text-lg mb-8 text-center font-mono">
              {errorMapping.message}
            </p>

            {/* Action buttons */}
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

            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyber-pink" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-pink" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-pink" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyber-pink" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <Button onClick={handleBack} variant="ghost" size="sm">
            ← Back
          </Button>

          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-cyber font-bold text-neon-cyan neon-text uppercase tracking-widest mb-1">
              AI Photobooth
            </h1>
            <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-sm font-mono">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span>STEP 3 / 3</span>
            </div>
          </div>

          <div className="w-32" />
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-5xl">
            {/* Success banner */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 glass-card px-8 py-3 rounded-full border-2 border-neon-green shadow-neon-cyan">
              <p className="text-neon-green text-base font-cyber font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Portrait Generated Successfully
              </p>
            </div>

            {/* Image frame */}
            <div className="relative aspect-video">
              {/* Outer glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-neon-cyan/30 via-neon-purple/30 to-neon-pink/30 rounded-3xl blur-2xl opacity-70 animate-pulse-neon" />

              {/* Animated border */}
              <div className="absolute -inset-3 border-4 border-neon-cyan rounded-2xl shadow-neon-cyan" />

              {/* Main frame */}
              <div className="relative h-full glass-card rounded-2xl border-2 border-neon-cyan/60 overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-10 h-10 border-t-4 border-l-4 border-neon-cyan z-10" />
                <div className="absolute top-3 right-3 w-10 h-10 border-t-4 border-r-4 border-neon-cyan z-10" />
                <div className="absolute bottom-3 left-3 w-10 h-10 border-b-4 border-l-4 border-neon-cyan z-10" />
                <div className="absolute bottom-3 right-3 w-10 h-10 border-b-4 border-r-4 border-neon-cyan z-10" />

                {/* Generated image */}
                {resultUrl && (
                  <img
                    src={resultUrl}
                    alt="Generated portrait"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
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
