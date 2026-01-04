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
        group relative flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden
        transition-all duration-500 transform
        ${isSelected
          ? 'border-4 border-neon-cyan shadow-neon-cyan scale-110 animate-pulse-neon'
          : 'border-2 border-neon-cyan/30 hover:border-neon-purple hover:scale-105 hover:shadow-neon-purple'}
      `}
    >
      {/* Glass card background */}
      <div className="absolute inset-0 glass-card">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/40 via-cyber-blue/40 to-cyber-pink/40" />

        {/* Cyber grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-30" />

        {/* Thumbnail icon with glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`
            text-9xl transition-all duration-500
            ${isSelected ? 'animate-float' : 'group-hover:scale-110'}
          `}>
            <span className="drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">🎨</span>
          </div>
        </div>

        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-8 group-hover:h-8" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-8 group-hover:h-8" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-8 group-hover:h-8" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-8 group-hover:h-8" />
      </div>

      {/* Style name banner */}
      <div className={`
        absolute bottom-0 left-0 right-0 p-4 backdrop-blur-md
        transition-all duration-300
        ${isSelected
          ? 'bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple'
          : 'bg-cyber-dark/80 border-t-2 border-neon-cyan/50'}
      `}>
        <h3 className={`
          text-2xl font-cyber font-bold uppercase tracking-widest
          transition-all duration-300
          ${isSelected ? 'text-cyber-darker neon-text' : 'text-neon-cyan'}
        `}>
          {style.name}
        </h3>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan animate-pulse">
          <span className="text-cyber-darker text-2xl font-bold">✓</span>
        </div>
      )}

      {/* Holographic shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </button>
  );
}
