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
        w-24 h-24 rounded-full border-4 border-white
        flex items-center justify-center
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer'}
      `}
      aria-label="Capture photo"
    >
      <div
        className={`
          w-16 h-16 rounded-full
          ${disabled ? 'bg-gray-400' : 'bg-neon-cyan shadow-lg shadow-neon-cyan/50'}
        `}
      />
    </button>
  );
}
