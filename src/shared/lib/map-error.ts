import type { ErrorCode } from '../types/api-types';

export interface ErrorMapping {
  title: string;
  message: string;
  canRetry: boolean;
  action: 'retry' | 'change-input' | 'stop';
}

export function mapError(code: ErrorCode): ErrorMapping {
  switch (code) {
    case 'RUNWARE_TEMPORARY':
      return {
        title: 'Temporary Error',
        message: 'Something went wrong. Please try again.',
        canRetry: true,
        action: 'retry',
      };

    case 'RUNWARE_BAD_INPUT':
      return {
        title: 'Invalid Input',
        message: 'Please capture a new photo or select a different style.',
        canRetry: false,
        action: 'change-input',
      };

    case 'RUNWARE_QUOTA':
      return {
        title: 'Service Unavailable',
        message: 'AI generation is temporarily unavailable. Please try again later.',
        canRetry: false,
        action: 'stop',
      };

    case 'DAILY_CAP':
      return {
        title: 'Daily Limit Reached',
        message: 'We\'ve reached our daily generation limit. Please come back tomorrow!',
        canRetry: false,
        action: 'stop',
      };

    case 'RATE_LIMITED':
      return {
        title: 'Too Many Requests',
        message: 'Please wait a moment before trying again.',
        canRetry: true,
        action: 'retry',
      };

    case 'BOT_CHECK_FAILED':
      return {
        title: 'Security Check Failed',
        message: 'Please refresh the page and try again.',
        canRetry: false,
        action: 'stop',
      };

    case 'EMAIL_TEMPORARY':
      return {
        title: 'Email Failed',
        message: 'Could not send email. Please try again.',
        canRetry: true,
        action: 'retry',
      };

    case 'EMAIL_BLOCKED':
      return {
        title: 'Email Blocked',
        message: 'This email address cannot receive photos.',
        canRetry: false,
        action: 'stop',
      };

    case 'UNKNOWN_ERROR':
    default:
      return {
        title: 'Unknown Error',
        message: 'Something unexpected happened. Please try again.',
        canRetry: true,
        action: 'retry',
      };
  }
}
