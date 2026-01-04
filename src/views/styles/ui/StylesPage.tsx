'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StyleCarousel } from '@/widgets/style-carousel/ui/StyleCarousel';
import { useSelectStyleStore } from '@/features/select-style/model/select-style-store';
import { useCaptureStore } from '@/features/capture-photo/model/capture-store';
import { useGenerationStore } from '@/features/generate-portrait/model/generation-store';
import { STYLES } from '@/entities/style/config/styles-catalog';
import { Button } from '@/shared/ui/Button';
import { GenerationProgress } from '@/features/generate-portrait/ui/GenerationProgress';
import { createIdempotencyKey } from '@/shared/lib/create-idempotency-key';
import { generatePortrait } from '@/features/generate-portrait/api/generate-portrait';
import { getStatus } from '@/features/generate-portrait/api/get-status';

export function StylesPage() {
  const router = useRouter();
  const { selectedStyleId, selectStyle } = useSelectStyleStore();
  const { blob } = useCaptureStore();
  const {
    idempotencyKey,
    jobId,
    status,
    progress,
    startGeneration,
    setJobId,
    updateStatus,
    setError,
  } = useGenerationStore();

  const isGenerating = status === 'queued' || status === 'running';

  React.useEffect(() => {
    if (!blob) {
      router.push('/capture');
    }
  }, [blob, router]);

  React.useEffect(() => {
    if (status === 'done') {
      router.push('/review');
    }
  }, [status, router]);

  // Poll for status updates
  React.useEffect(() => {
    if (!jobId || status === 'done' || status === 'failed') return;

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await getStatus(jobId);
        updateStatus(statusResponse.status, statusResponse.progress, statusResponse.resultUrl);

        if (statusResponse.error) {
          setError(statusResponse.error);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Failed to poll status:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [jobId, status]);

  const handleStart = async () => {
    if (!selectedStyleId || !blob) return;

    const key = idempotencyKey || createIdempotencyKey();
    startGeneration(key);

    try {
      const response = await generatePortrait(blob, selectedStyleId, key);
      setJobId(response.jobId);
      updateStatus(response.status, 0, response.resultUrl);
    } catch (error) {
      setError({
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Failed to start generation',
      });
    }
  };

  const handleBack = () => {
    router.push('/capture');
  };

  if (isGenerating) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-neon-pink/20 to-cyber-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          {/* Logo */}
          <h1 className="text-4xl md:text-5xl font-cyber font-bold text-neon-cyan neon-text uppercase tracking-widest mb-16">
            AI Photobooth
          </h1>

          {/* Progress component */}
          <GenerationProgress progress={progress} status={status} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-cyber-pink/20 to-neon-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
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
              <span>STEP 2 / 3</span>
            </div>
          </div>

          <div className="w-32" />
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-8 md:gap-12">
          {/* Title section */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-cyber font-bold text-neon-purple neon-text uppercase tracking-wider mb-3">
              Choose Your Style
            </h2>
            <p className="text-neon-cyan/70 text-sm md:text-base font-mono">
              Select an AI art style to transform your photo
            </p>
          </div>

          {/* Style carousel */}
          <div className="w-full">
            <StyleCarousel
              styles={STYLES}
              selectedStyleId={selectedStyleId}
              onSelectStyle={selectStyle}
            />
          </div>

          {/* Action section */}
          <div className="w-full max-w-2xl space-y-6">
            {/* Selection indicator */}
            {selectedStyleId && (
              <div className="text-center">
                <p className="text-neon-green text-lg font-cyber flex items-center justify-center gap-2">
                  <span>✓</span>
                  Style Selected
                </p>
              </div>
            )}

            {/* Start button */}
            <div className="flex justify-center">
              <Button
                onClick={handleStart}
                disabled={!selectedStyleId}
                variant="primary"
                size="lg"
                className="min-w-80 py-6 text-xl"
              >
                <span className="flex items-center gap-3">
                  <span>🎨</span>
                  <span>GENERATE PORTRAIT</span>
                  <span>→</span>
                </span>
              </Button>
            </div>

            {/* Helper text */}
            {!selectedStyleId && (
              <p className="text-center text-neon-cyan/50 text-sm font-mono animate-pulse">
                Select a style to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
