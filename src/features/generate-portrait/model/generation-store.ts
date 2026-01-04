import { create } from 'zustand';
import type { GenerationStatus, ApiError } from '@/shared/types/api-types';

interface GenerationState {
  idempotencyKey: string | null;
  jobId: string | null;
  status: GenerationStatus | null;
  progress: number;
  resultUrl: string | null;
  error: ApiError | null;

  startGeneration: (idempotencyKey: string) => void;
  setJobId: (jobId: string) => void;
  updateStatus: (status: GenerationStatus, progress: number, resultUrl: string | null) => void;
  setError: (error: ApiError) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  idempotencyKey: null,
  jobId: null,
  status: null,
  progress: 0,
  resultUrl: null,
  error: null,

  startGeneration: (idempotencyKey) =>
    set({
      idempotencyKey,
      status: 'queued',
      progress: 0,
      error: null,
      resultUrl: null,
    }),

  setJobId: (jobId) => set({ jobId }),

  updateStatus: (status, progress, resultUrl) =>
    set({ status, progress, resultUrl }),

  setError: (error) => set({ error, status: 'failed' }),

  reset: () =>
    set({
      idempotencyKey: null,
      jobId: null,
      status: null,
      progress: 0,
      resultUrl: null,
      error: null,
    }),
}));
