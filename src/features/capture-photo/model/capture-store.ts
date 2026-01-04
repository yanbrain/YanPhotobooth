import { create } from 'zustand';

interface CaptureState {
  blob: Blob | null;
  previewUrl: string | null;
  isCapturing: boolean;
  error: string | null;

  setCapture: (blob: Blob, previewUrl: string) => void;
  clearCapture: () => void;
  setError: (error: string | null) => void;
  setCapturing: (isCapturing: boolean) => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  blob: null,
  previewUrl: null,
  isCapturing: false,
  error: null,

  setCapture: (blob, previewUrl) =>
    set({ blob, previewUrl, isCapturing: false, error: null }),

  clearCapture: () =>
    set({ blob: null, previewUrl: null, isCapturing: false, error: null }),

  setError: (error) => set({ error, isCapturing: false }),

  setCapturing: (isCapturing) => set({ isCapturing }),
}));
