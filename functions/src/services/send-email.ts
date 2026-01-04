import { validateEmail } from '../domain/validators';
import { DomainError } from '../domain/errors';
import { sendEmailWithImage } from '../adapters/email-client';
import { verifyBotToken } from '../adapters/bot-check';
import { checkRateLimit } from '../adapters/rate-limiter';
import { getJobStatus } from './generate-portrait';
import { logger } from '../lib/logger';

export async function sendGeneratedEmail(
  jobId: string,
  email: string,
  botToken: string,
  clientIp: string
): Promise<void> {
  // Validate email
  if (!validateEmail(email)) {
    throw new DomainError('EMAIL_BLOCKED', 'Invalid email address');
  }

  // Bot check
  verifyBotToken(botToken);

  // Rate limit
  checkRateLimit(`email:${clientIp}`, 5, 60 * 1000);

  // Get job
  const job = getJobStatus(jobId);
  if (!job) {
    throw new DomainError('RUNWARE_BAD_INPUT', 'Job not found');
  }

  if (job.status !== 'done' || !job.resultUrl) {
    throw new DomainError('RUNWARE_BAD_INPUT', 'Job is not completed');
  }

  // Send email
  logger.info('Sending email', { jobId, email });
  await sendEmailWithImage(email, job.resultUrl);

  logger.info('Email sent successfully', { jobId, email });
}
