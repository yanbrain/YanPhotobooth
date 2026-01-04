import * as functions from 'firebase-functions';
import { handleGenerate } from './http/generate';
import { handleStatus } from './http/status';
import { handleEmail } from './http/email';
import { validateEnv } from './config/env';
import { logger } from './lib/logger';

// Validate environment on startup
try {
  validateEnv();
  logger.info('Environment validated successfully');
} catch (error) {
  logger.error('Environment validation failed', error);
}

// HTTP endpoints
export const generate = functions.https.onRequest(handleGenerate);
export const status = functions.https.onRequest(handleStatus);
export const email = functions.https.onRequest(handleEmail);
