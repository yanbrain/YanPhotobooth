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
      {/* Glass card container */}
      <div className="glass-card rounded-2xl border-2 border-neon-cyan/40 p-8 shadow-glass">
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-5 rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative space-y-6">
          {/* Status icon and message */}
          <div className="text-center">
            {/* Animated icon */}
            <div className={`text-7xl mb-4 ${status === 'running' ? 'animate-float' : 'animate-pulse-neon'}`}>
              {getIcon()}
            </div>

            {/* Status message */}
            <p className={`text-3xl font-cyber font-bold ${getStatusColor()} neon-text mb-3`}>
              {getMessage()}
            </p>

            {/* Progress percentage */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-cyber font-bold text-white">
                {Math.round(progress)}
              </span>
              <span className="text-2xl font-cyber text-neon-cyan/60">%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <ProgressBar progress={progress} showPercentage={false} />
          </div>

          {/* Status details */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-neon-cyan animate-pulse' : 'bg-neon-cyan/50'}`} />
            <span className="text-sm font-mono text-neon-cyan/70 uppercase tracking-wider">
              {status}
            </span>
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan/60" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-cyan/60" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-cyan/60" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-neon-cyan/60" />
      </div>
    </div>
  );
}
