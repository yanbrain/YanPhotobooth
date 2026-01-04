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
        relative flex-shrink-0 w-80 h-96 rounded-xl overflow-hidden
        transition-all duration-300
        ${isSelected
          ? 'border-4 border-neon-cyan shadow-2xl shadow-neon-cyan/50 scale-105'
          : 'border-2 border-purple-500/50 hover:border-neon-purple hover:scale-105'}
      `}
    >
      {/* Thumbnail image placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <span className="text-6xl opacity-50">🎨</span>
      </div>

      {/* Style name */}
      <div className={`
        absolute bottom-0 left-0 right-0 p-4
        ${isSelected ? 'bg-neon-cyan text-black' : 'bg-black/70 text-white'}
      `}>
        <h3 className="text-2xl font-bold uppercase tracking-wider">
          {style.name}
        </h3>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neon-cyan flex items-center justify-center">
          <span className="text-black text-xl">✓</span>
        </div>
      )}
    </button>
  );
}
