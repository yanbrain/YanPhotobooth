import * as functions from 'firebase-functions';
import { handleGenerate } from './controllers/generate';
import { handleStatus } from './controllers/status';
import { handleEmail } from './controllers/email';
import { validateEnv } from './config/env';
import { logger } from './utils/logger';

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
