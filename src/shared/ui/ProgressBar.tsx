import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full h-3 bg-purple-900/50 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
