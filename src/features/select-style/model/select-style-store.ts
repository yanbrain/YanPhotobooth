import { create } from 'zustand';

interface SelectStyleState {
  selectedStyleId: string | null;
  selectStyle: (styleId: string) => void;
  clearSelection: () => void;
}

export const useSelectStyleStore = create<SelectStyleState>((set) => ({
  selectedStyleId: null,

  selectStyle: (styleId) => set({ selectedStyleId: styleId }),

  clearSelection: () => set({ selectedStyleId: null }),
}));
