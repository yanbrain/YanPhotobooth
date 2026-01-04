import { env } from '../config/env';
import { EmailError } from '../domain/errors';
import { logger } from '../lib/logger';
import { sendEmailMock } from './mocks/email-mock';

export async function sendEmailWithImage(
  to: string,
  imageUrl: string
): Promise<void> {
  // Use mock in local development
  if (env.useMock) {
    return sendEmailMock(to, imageUrl);
  }

  const provider = env.emailProvider;

  logger.info('Sending email', { to, provider });

  // For v1, we'll use a simple mock implementation
  // In production, integrate with SendGrid, Mailgun, etc.

  if (!env.emailApiKey) {
    logger.warn('Email API key not configured - email not sent');
    // In development, just log success
    if (process.env.NODE_ENV === 'development') {
      logger.info('Development mode: Email would be sent', { to, imageUrl });
      return;
    }
    throw new EmailError('Email service not configured', false);
  }

  // Mock email sending for now
  // TODO: Implement actual email provider integration
  try {
    // Simulate async email send
    await new Promise((resolve) => setTimeout(resolve, 100));

    logger.info('Email sent successfully', { to });
  } catch (error) {
    logger.error('Email send failed', error);
    throw new EmailError('Failed to send email', false);
  }
}
