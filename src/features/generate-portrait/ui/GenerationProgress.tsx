'use client';

import React from 'react';
import { ProgressBar } from '@/shared/ui/ProgressBar';

interface GenerationProgressProps {
  progress: number;
  status: string;
}

export function GenerationProgress({ progress, status }: GenerationProgressProps) {
  const getMessage = () => {
    switch (status) {
      case 'queued':
        return 'Preparing your portrait...';
      case 'running':
        return 'AI is creating your masterpiece...';
      case 'done':
        return 'Complete!';
      case 'failed':
        return 'Generation failed';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-neon-cyan mb-2">{getMessage()}</p>
        <p className="text-lg text-white">{Math.round(progress)}%</p>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
}
