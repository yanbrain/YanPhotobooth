import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  className = '',
  showPercentage = true,
  label
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-mono text-neon-cyan uppercase tracking-wider">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-cyber font-bold text-neon-purple">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}

      <div className="relative w-full h-4 bg-cyber-dark border border-neon-cyan/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(0, 229, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '10px 100%'
        }} />

        <div
          className="relative h-full bg-neon-cyan/80 transition-all duration-500 ease-out shadow-neon-cyan"
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
               style={{
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 2s infinite'
               }}
          />
        </div>

        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-cyan/40 to-transparent transition-all duration-500"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
