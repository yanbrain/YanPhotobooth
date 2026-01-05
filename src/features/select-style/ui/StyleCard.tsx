'use client';

import React from 'react';
import type { Style } from '@/entities/style/model/style-types';

interface StyleCardProps {
  style: Style;
  isSelected: boolean;
  onClick: () => void;
}

export function StyleCard({ style, isSelected, onClick }: StyleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex-shrink-0 w-72 h-80 rounded-none border overflow-visible
        transition-all duration-500 transform
        ${isSelected
          ? 'border-2 border-neon-cyan shadow-neon-cyan scale-105'
          : 'border border-neon-cyan/30 hover:border-neon-purple hover:scale-105 hover:shadow-neon-purple'}
      `}
    >
      <div className="absolute inset-0 glass-card overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-15" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            text-9xl transition-all duration-500
            ${isSelected ? 'animate-float' : 'group-hover:scale-110'}
          `}>
            <span className="drop-shadow-[0_0_18px_rgba(0,229,255,0.6)]">🎨</span>
          </div>
        </div>

        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-7 group-hover:h-7" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-7 group-hover:h-7" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-7 group-hover:h-7" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-7 group-hover:h-7" />
      </div>

      <div
        className={`
          absolute bottom-0 left-0 right-0 p-4
          transition-all duration-300
          ${isSelected
            ? 'bg-cyber-dark border-t border-neon-cyan/60'
            : 'bg-cyber-dark/90 border-t border-neon-cyan/40'}
        `}
      >
        <h3
          className={`
            text-xl font-cyber font-semibold uppercase tracking-[0.3em]
            transition-all duration-300
            ${isSelected ? 'text-neon-cyan neon-text' : 'text-neon-cyan'}
          `}
        >
          {style.name}
        </h3>
      </div>

      {isSelected && (
        <div className="absolute top-4 right-4 w-10 h-10 border border-neon-cyan flex items-center justify-center shadow-neon-cyan">
          <span className="text-neon-cyan text-xl font-semibold">✓</span>
        </div>
      )}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </button>
  );
}
