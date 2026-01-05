'use client';

import React from 'react';

interface ShutterButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ShutterButton({ onClick, disabled = false }: ShutterButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full
        transition-all duration-300 transform
        ${
          disabled
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95 cursor-pointer'
        }
      `}
      aria-label="Capture photo"
    >
      <div
        className={`
          absolute inset-0 rounded-full border-4
          ${
            disabled
              ? 'border-gray-700'
              : 'border-neon-cyan shadow-neon-cyan group-hover:border-neon-purple'
          }
          transition-all duration-300
        `}
      />

      <div
        className={`
          absolute inset-2 rounded-full border-2
          ${disabled ? 'border-gray-700' : 'border-neon-cyan/30'}
          transition-all duration-300
        `}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`
            relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden
            ${
              disabled
                ? 'bg-gray-700'
                : 'bg-cyber-dark border border-neon-cyan/60'
            }
            transition-all duration-300
            ${!disabled && 'group-hover:border-neon-purple'}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`
                w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full
                ${disabled ? 'bg-gray-600' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'}
                transition-all duration-300
              `}
            />
          </div>
        </div>
      </div>

      {!disabled && (
        <div className="absolute inset-0 rounded-full bg-neon-cyan/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}

    </button>
  );
}
