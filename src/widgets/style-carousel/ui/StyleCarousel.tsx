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
      {/* Carousel container */}
      <div className="flex items-center gap-8">
        {/* Left arrow */}
        <button
          onClick={handlePrevious}
          disabled={!canScrollLeft}
          className={`flex-shrink-0 w-16 h-16 rounded-full bg-purple-900/50 border-2 border-neon-cyan flex items-center justify-center text-3xl transition-all ${
            canScrollLeft
              ? 'hover:bg-neon-cyan/20 hover:scale-110 cursor-pointer text-neon-cyan'
              : 'opacity-30 cursor-not-allowed text-gray-500'
          }`}
          aria-label="Previous style"
        >
          ‹
        </button>

        {/* Styles scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-hidden"
        >
          <div className="flex gap-8">
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

        {/* Right arrow */}
        <button
          onClick={handleNext}
          disabled={!canScrollRight}
          className={`flex-shrink-0 w-16 h-16 rounded-full bg-purple-900/50 border-2 border-neon-cyan flex items-center justify-center text-3xl transition-all ${
            canScrollRight
              ? 'hover:bg-neon-cyan/20 hover:scale-110 cursor-pointer text-neon-cyan'
              : 'opacity-30 cursor-not-allowed text-gray-500'
          }`}
          aria-label="Next style"
        >
          ›
        </button>
      </div>
    </div>
  );
}
