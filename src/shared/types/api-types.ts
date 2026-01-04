// API request/response types

export type GenerationStatus = 'queued' | 'running' | 'done' | 'failed';

export interface GenerateRequest {
  image: File;
  styleId: string;
  idempotencyKey: string;
  botToken: string;
  clientSessionId?: string;
}

export interface GenerateResponse {
  jobId: string;
  status: GenerationStatus;
  resultUrl: string | null;
  error: ApiError | null;
}

export interface StatusResponse {
  jobId: string;
  status: GenerationStatus;
  progress: number;
  resultUrl: string | null;
  error: ApiError | null;
}

export interface EmailRequest {
  jobId: string;
  email: string;
  botToken: string;
}

export interface EmailResponse {
  ok: boolean;
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

export interface ApiError {
  code: ErrorCode;
  message: string;
}
