import { logger } from '../../utils/logger';

// Mock email client for local development
// Logs email details instead of actually sending

export async function sendEmailMock(
  to: string,
  imageUrl: string
): Promise<void> {
  logger.info('📧 MOCK: Email send simulation', { to, imageUrl });

  // Simulate email send delay
  const mockDelay = parseInt(process.env.MOCK_EMAIL_DELAY || '500', 10);
  await new Promise((resolve) => setTimeout(resolve, mockDelay));

  // Log the email that would have been sent
  console.log('\n' + '='.repeat(60));
  console.log('📧 MOCK EMAIL SENT');
  console.log('='.repeat(60));
  console.log(`To: ${to}`);
  console.log(`Subject: Your AI Photobooth Portrait`);
  console.log(`Image: ${imageUrl}`);
  console.log('='.repeat(60) + '\n');

  logger.info('✅ MOCK: Email sent successfully', { to });
}

// Mock error for testing
export async function sendEmailMockWithError(
  to: string,
  imageUrl: string
): Promise<void> {
  logger.info('❌ MOCK: Simulating email error', { to });

  await new Promise((resolve) => setTimeout(resolve, 500));

  throw new Error('MOCK: Simulated email error for testing');
}
