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
          {!disabled && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent group-hover:rotate-180 transition-transform duration-500" />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              📸
            </span>
          </div>
        </div>
      </div>

      {!disabled && (
        <div className="absolute inset-0 rounded-full bg-neon-cyan/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}

      {!disabled && (
        <>
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
    </button>
  );
}
