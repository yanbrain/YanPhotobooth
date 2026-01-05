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

  const getStatusColor = () => {
    switch (status) {
      case 'done':
        return 'text-neon-green';
      case 'failed':
        return 'text-cyber-pink';
      default:
        return 'text-neon-cyan';
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="glass-card rounded-none border border-neon-cyan/40 p-8 shadow-glass">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

        <div className="relative space-y-6">
          <div className="text-center">
            <p className={`text-2xl font-cyber font-semibold ${getStatusColor()} neon-text mb-3 uppercase tracking-[0.2em]`}>
              {getMessage()}
            </p>

            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-cyber font-semibold text-white">
                {Math.round(progress)}
              </span>
              <span className="text-2xl font-cyber text-neon-cyan/60">%</span>
            </div>
          </div>

          <div>
            <ProgressBar progress={progress} showPercentage={false} />
          </div>

          <div className="flex items-center justify-center pt-2">
            <span className="text-sm font-mono text-neon-cyan/70 uppercase tracking-[0.2em]">
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
