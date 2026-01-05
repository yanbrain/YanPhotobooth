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

  const getIcon = () => {
    switch (status) {
      case 'queued':
        return '⏳';
      case 'running':
        return '🎨';
      case 'done':
        return '✨';
      case 'failed':
        return '⚠️';
      default:
        return '⚙️';
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
            <div className={`text-6xl mb-4 ${status === 'running' ? 'animate-float' : ''}`}>
              {getIcon()}
            </div>

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

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className={`w-2 h-2 ${status === 'running' ? 'bg-neon-cyan animate-pulse' : 'bg-neon-cyan/50'}`} />
            <span className="text-sm font-mono text-neon-cyan/70 uppercase tracking-[0.2em]">
              {status}
            </span>
          </div>
        </div>

        <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-neon-cyan/60" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-neon-cyan/60" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-neon-cyan/60" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-neon-cyan/60" />
      </div>
    </div>
  );
}
