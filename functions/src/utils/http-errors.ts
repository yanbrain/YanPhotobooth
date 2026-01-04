// HTTP error handling utilities

import { DomainError } from '../domain/errors';

export function handleError(error: unknown): { statusCode: number; body: { error: unknown } } {
  if (error instanceof DomainError) {
    return {
      statusCode: error.statusCode,
      body: { error: error.toResponse() },
    };
  }

  if (error instanceof Error) {
    // Known error types
    if (error.name === 'ValidationError') {
      return { statusCode: 400, body: { error: { code: 'VALIDATION_ERROR', message: error.message } } };
    }

    if (error.name === 'BotCheckError') {
      return { statusCode: 403, body: { error: { code: 'BOT_CHECK_FAILED', message: 'Bot check failed' } } };
    }

    if (error.name === 'RateLimitError') {
      return { statusCode: 429, body: { error: { code: 'RATE_LIMIT_EXCEEDED', message: error.message } } };
    }
  }

  // Generic error
  return { statusCode: 500, body: { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } } };
}
