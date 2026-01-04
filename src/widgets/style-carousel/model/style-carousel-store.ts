import { create } from 'zustand';

interface StyleCarouselState {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  nextStyle: () => void;
  previousStyle: () => void;
}

export const useStyleCarouselStore = create<StyleCarouselState>((set) => ({
  currentIndex: 0,

  setCurrentIndex: (index) => set({ currentIndex: index }),

  nextStyle: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    })),

  previousStyle: () =>
    set((state) => ({
      currentIndex: Math.max(0, state.currentIndex - 1),
    })),
}));
