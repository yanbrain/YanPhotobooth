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
            <svg
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 ${disabled ? 'text-gray-500' : 'text-neon-cyan'}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Zm0 2a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm.02 1.9 3.7 2.13a.75.75 0 0 1 .27 1.02l-2.13 3.7a.75.75 0 0 1-.65.38H9.8a.75.75 0 0 1-.65-.38l-2.13-3.7a.75.75 0 0 1 .27-1.02l3.7-2.13a.75.75 0 0 1 .76 0Z" />
            </svg>
          </div>
        </div>
      </div>

      {!disabled && (
        <div className="absolute inset-0 rounded-full bg-neon-cyan/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}

    </button>
  );
}
