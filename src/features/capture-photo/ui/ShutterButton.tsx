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
        group relative w-28 h-28 rounded-full
        transition-all duration-300 transform
        ${
          disabled
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:scale-110 active:scale-95 cursor-pointer'
        }
      `}
      aria-label="Capture photo"
    >
      {/* Outer ring with neon glow */}
      <div
        className={`
          absolute inset-0 rounded-full border-4
          ${
            disabled
              ? 'border-gray-600'
              : 'border-neon-cyan shadow-neon-cyan group-hover:shadow-neon-purple group-hover:border-neon-purple'
          }
          transition-all duration-300
        `}
      />

      {/* Middle ring (decorative) */}
      <div
        className={`
          absolute inset-2 rounded-full border-2
          ${disabled ? 'border-gray-700' : 'border-neon-cyan/30'}
          transition-all duration-300
        `}
      />

      {/* Inner button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`
            relative w-20 h-20 rounded-full overflow-hidden
            ${
              disabled
                ? 'bg-gray-700'
                : 'bg-gradient-to-br from-neon-cyan via-cyber-blue to-neon-purple'
            }
            transition-all duration-300
            ${!disabled && 'group-hover:animate-pulse-neon'}
          `}
        >
          {/* Shine effect */}
          {!disabled && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent group-hover:rotate-180 transition-transform duration-500" />
          )}

          {/* Camera icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              📸
            </span>
          </div>
        </div>
      </div>

      {/* Outer glow pulse */}
      {!disabled && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      )}

      {/* Corner brackets */}
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
