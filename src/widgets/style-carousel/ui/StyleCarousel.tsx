'use client';

import React, { useRef, useEffect } from 'react';
import { StyleCard } from '@/features/select-style/ui/StyleCard';
import type { Style } from '@/entities/style/model/style-types';
import { useStyleCarouselStore } from '../model/style-carousel-store';

interface StyleCarouselProps {
  styles: Style[];
  selectedStyleId: string | null;
  onSelectStyle: (styleId: string) => void;
}

export function StyleCarousel({
  styles,
  selectedStyleId,
  onSelectStyle,
}: StyleCarouselProps) {
  const { currentIndex, setCurrentIndex, nextStyle, previousStyle } =
    useStyleCarouselStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < styles.length - 1;

  const handleNext = () => {
    if (canScrollRight) {
      nextStyle();
    }
  };

  const handlePrevious = () => {
    if (canScrollLeft) {
      previousStyle();
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320 + 32; // card width + gap
      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative flex items-center gap-6">
        <button
          onClick={handlePrevious}
          disabled={!canScrollLeft}
          className={`
            group relative flex-shrink-0 w-20 h-20 rounded-none border
            transition-all duration-300 transform
            ${
              canScrollLeft
                ? 'glass-card border-neon-cyan/50 hover:border-neon-cyan hover:scale-105 hover:shadow-neon-cyan cursor-pointer'
                : 'bg-cyber-dark/20 border-neon-cyan/10 opacity-20 cursor-not-allowed'
            }
          `}
          aria-label="Previous style"
        >
          {canScrollLeft && (
            <>
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-4 group-hover:h-4" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            </>
          )}

          <div className={`
            absolute inset-0 flex items-center justify-center text-4xl font-bold
            ${canScrollLeft ? 'text-neon-cyan' : 'text-gray-600'}
          `}>
            ‹
          </div>

          {canScrollLeft && (
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>

        <div className="relative flex-1">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-cyber-darker via-cyber-darker/80 to-transparent z-10 pointer-events-none" />

          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-cyber-darker via-cyber-darker/80 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollContainerRef}
            className="overflow-hidden"
          >
            <div className="flex gap-8 px-4">
              {styles.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  isSelected={selectedStyleId === style.id}
                  onClick={() => onSelectStyle(style.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!canScrollRight}
          className={`
            group relative flex-shrink-0 w-20 h-20 rounded-none border
            transition-all duration-300 transform
            ${
              canScrollRight
                ? 'glass-card border-neon-cyan/50 hover:border-neon-cyan hover:scale-105 hover:shadow-neon-cyan cursor-pointer'
                : 'bg-cyber-dark/20 border-neon-cyan/10 opacity-20 cursor-not-allowed'
            }
          `}
          aria-label="Next style"
        >
          {canScrollRight && (
            <>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-4 group-hover:h-4" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            </>
          )}

          <div className={`
            absolute inset-0 flex items-center justify-center text-4xl font-bold
            ${canScrollRight ? 'text-neon-cyan' : 'text-gray-600'}
          `}>
            ›
          </div>

          {canScrollRight && (
            <div className="absolute inset-0 bg-gradient-to-l from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {styles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              relative transition-all duration-300
              ${
                index === currentIndex
                  ? 'w-12 h-2 bg-neon-cyan/80 shadow-neon-cyan'
                  : 'w-2 h-2 bg-neon-cyan/30 hover:bg-neon-cyan/60'
              }
            `}
            aria-label={`Go to style ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
