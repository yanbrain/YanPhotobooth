import type { ErrorCode, ErrorResponse } from './types';

/**
 * Maps error codes to HTTP status codes
 */
const ERROR_CODE_TO_HTTP_STATUS: Record<ErrorCode, number> = {
  RUNWARE_TEMPORARY: 503,
  RUNWARE_BAD_INPUT: 400,
  RUNWARE_QUOTA: 402,
  DAILY_CAP: 429,
  RATE_LIMITED: 429,
  BOT_CHECK_FAILED: 403,
  EMAIL_TEMPORARY: 503,
  EMAIL_BLOCKED: 400,
  UNKNOWN_ERROR: 500,
};

/**
 * Base domain error with error code and HTTP status mapping
 */
export class DomainError extends Error {
  public readonly statusCode: number;

  constructor(
    public readonly code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'DomainError';
    this.statusCode = ERROR_CODE_TO_HTTP_STATUS[code];
  }

  toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class RunwareError extends DomainError {
  constructor(message: string, temporary = false) {
    super(temporary ? 'RUNWARE_TEMPORARY' : 'RUNWARE_BAD_INPUT', message);
    this.name = 'RunwareError';
  }
}

export class RateLimitError extends DomainError {
  constructor(message = 'Too many requests. Please try again later.') {
    super('RATE_LIMITED', message);
    this.name = 'RateLimitError';
  }
}

export class BotCheckError extends DomainError {
  constructor(message = 'Bot check failed') {
    super('BOT_CHECK_FAILED', message);
    this.name = 'BotCheckError';
  }
}

export class DailyCapError extends DomainError {
  constructor(message = 'Daily generation limit reached') {
    super('DAILY_CAP', message);
    this.name = 'DailyCapError';
  }
}

export class EmailError extends DomainError {
  constructor(message: string, blocked = false) {
    super(blocked ? 'EMAIL_BLOCKED' : 'EMAIL_TEMPORARY', message);
    this.name = 'EmailError';
  }
}
