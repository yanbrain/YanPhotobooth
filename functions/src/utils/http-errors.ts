// HTTP error handling utilities

import { Response } from 'firebase-functions/v1';
import { logger } from './logger';

export function handleError(error: unknown, res: Response): void {
  logger.error('Request failed', error);

  if (error instanceof Error) {
    // Known error types
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.name === 'BotCheckError') {
      res.status(403).json({ error: 'Bot check failed' });
      return;
    }

    if (error.name === 'RateLimitError') {
      res.status(429).json({ error: error.message });
      return;
    }

    // Generic error
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: 'Unknown error occurred' });
  }
}
