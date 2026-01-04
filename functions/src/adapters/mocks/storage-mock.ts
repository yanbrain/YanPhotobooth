import { logger } from '../../lib/logger';

// Mock storage client for local development
// Returns fake URLs instead of actually uploading to Firebase Storage

const MOCK_STORAGE_BASE = 'https://storage.googleapis.com/mock-bucket';

export async function uploadImageMock(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  logger.info('☁️ MOCK: Storage upload simulation', {
    filename,
    contentType,
    size: buffer.length
  });

  // Simulate upload delay
  const mockDelay = parseInt(process.env.MOCK_STORAGE_DELAY || '300', 10);
  await new Promise((resolve) => setTimeout(resolve, mockDelay));

  // Generate fake URL
  const mockUrl = `${MOCK_STORAGE_BASE}/generated/${filename}`;

  logger.info('✅ MOCK: Upload complete', { filename, url: mockUrl });
  return mockUrl;
}

export async function downloadImageAsBase64Mock(url: string): Promise<string> {
  logger.info('⬇️ MOCK: Image download simulation', { url });

  // Simulate download delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return a small base64 encoded 1x1 pixel transparent PNG
  const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  logger.info('✅ MOCK: Download complete', { url });
  return mockBase64;
}
