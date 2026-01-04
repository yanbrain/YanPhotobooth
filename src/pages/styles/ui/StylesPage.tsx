'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { StyleCarousel } from '@/widgets/style-carousel/ui/StyleCarousel';
import { useSelectStyleStore } from '@/features/select-style/model/select-style-store';
import { useCaptureStore } from '@/features/capture-photo/model/capture-store';
import { useGenerationStore } from '@/features/generate-portrait/model/generation-store';
import { STYLES } from '@/entities/style/config/styles-catalog';
import { Button } from '@/shared/ui/Button';
import { ProgressBar } from '@/shared/ui/ProgressBar';
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-white uppercase tracking-wider mb-12">
          AI Photobooth
        </h1>
        <div className="w-full max-w-md">
          <ProgressBar progress={progress} />
          <p className="text-center text-neon-cyan text-xl mt-4">
            {status === 'queued' ? 'Starting generation...' : 'Creating your portrait...'}
          </p>
          <p className="text-center text-white text-lg mt-2">{Math.round(progress)}%</p>
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
        <h2 className="text-3xl font-bold text-neon-cyan">Choose Your Style</h2>

        <StyleCarousel
          styles={STYLES}
          selectedStyleId={selectedStyleId}
          onSelectStyle={selectStyle}
        />

        <div className="w-full max-w-2xl">
          <ProgressBar progress={selectedStyleId ? 100 : 0} className="mb-8" />
          <div className="flex justify-center">
            <Button
              onClick={handleStart}
              disabled={!selectedStyleId}
              variant="primary"
              size="lg"
              className="min-w-64"
            >
              START
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
