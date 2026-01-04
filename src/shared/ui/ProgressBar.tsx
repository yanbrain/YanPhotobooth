import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
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

      <div className="relative w-full h-4 bg-cyber-dark/60 rounded-full border border-neon-cyan/30 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '10px 100%'
        }} />

        {/* Progress bar */}
        <div
          className="relative h-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple transition-all duration-500 ease-out shadow-neon-cyan animate-pulse-neon"
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
               style={{
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 2s infinite'
               }}
          />
        </div>

        {/* Glow effect */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-cyan/50 to-neon-purple/50 blur-sm transition-all duration-500"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
