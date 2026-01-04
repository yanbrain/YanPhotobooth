import type { ErrorCode, ErrorResponse } from './types';

export class DomainError extends Error {
  constructor(
    public code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'DomainError';
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
