import type { ErrorCode } from '@/shared/types/api-types';

export class GenerationError extends Error {
  constructor(
    public code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}
