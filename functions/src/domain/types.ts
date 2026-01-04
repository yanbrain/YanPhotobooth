// Domain types

export type GenerationStatus = 'queued' | 'running' | 'done' | 'failed';

export interface GenerationJob {
  id: string;
  idempotencyKey: string;
  styleId: string;
  status: GenerationStatus;
  progress: number;
  imageUrl: string | null;
  resultUrl: string | null;
  error: ErrorResponse | null;
  createdAt: number;
  updatedAt: number;
}

export type ErrorCode =
  | 'RUNWARE_TEMPORARY'
  | 'RUNWARE_BAD_INPUT'
  | 'RUNWARE_QUOTA'
  | 'DAILY_CAP'
  | 'RATE_LIMITED'
  | 'BOT_CHECK_FAILED'
  | 'EMAIL_TEMPORARY'
  | 'EMAIL_BLOCKED'
  | 'UNKNOWN_ERROR';

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
}
