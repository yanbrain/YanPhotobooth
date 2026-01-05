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
        <div className="fixed inset-0 bg-cyber-darker">
          <div className="absolute inset-0 cyber-grid opacity-15" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 md:py-10">
          <div className="w-full max-w-4xl">
            <div className="relative glass-card rounded-none border border-neon-cyan/40 shadow-glass">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <div className="relative flex flex-col items-center justify-center px-6 py-14 gap-12 min-h-[70vh]">
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.3em] mb-3">
                    AI Photobooth
                  </h1>
                  <p className="text-neon-cyan/60 text-xs font-mono uppercase tracking-[0.4em]">
                    Generating Portrait
                  </p>
                </div>

                <GenerationProgress progress={progress} status={status} />
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
                    Step 2 / 3
                  </p>
                </div>

                <div className="flex items-center justify-end text-neon-cyan/60 text-xs font-mono uppercase tracking-[0.3em]">
                  Style Matrix
                </div>
              </header>

              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8 md:gap-12">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-cyber font-semibold text-neon-purple neon-text uppercase tracking-[0.25em] mb-3">
                    Choose Your Style
                  </h2>
                  <p className="text-neon-cyan/70 text-sm md:text-base font-mono">
                    Select an AI art style to transform your photo
                  </p>
                </div>

                <div className="w-full max-w-5xl">
                  <div className="relative glass-card rounded-none border border-neon-cyan/30 p-6">
                    <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                    <div className="relative">
                      <StyleCarousel
                        styles={STYLES}
                        selectedStyleId={selectedStyleId}
                        onSelectStyle={selectStyle}
                      />
                    </div>
                    <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-neon-cyan/40" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-neon-cyan/40" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-neon-cyan/40" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-neon-cyan/40" />
                  </div>
                </div>

                <div className="w-full max-w-2xl space-y-6">
                  {selectedStyleId && (
                    <div className="text-center">
                      <p className="text-neon-green text-lg font-cyber flex items-center justify-center gap-3 tracking-[0.2em] uppercase">
                        <span>✓</span>
                        Style Selected
                      </p>
                    </div>
                  )}

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

                  {!selectedStyleId && (
                    <p className="text-center text-neon-cyan/50 text-sm font-mono animate-pulse">
                      Select a style to continue
                    </p>
                  )}
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
    </div>
  );
}
