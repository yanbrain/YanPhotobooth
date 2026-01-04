import { logger } from '../../utils/logger';

// Mock Runware client for local development
// Returns fake images instantly without API calls

const MOCK_IMAGES = [
  'https://picsum.photos/seed/cyber1/1024/1024',
  'https://picsum.photos/seed/medieval1/1024/1024',
  'https://picsum.photos/seed/anime1/1024/1024',
  'https://picsum.photos/seed/vintage1/1024/1024',
  'https://picsum.photos/seed/fantasy1/1024/1024',
];

export async function generateWithRunwareMock(
  imageBase64: string,
  prompt: string,
  taskId: string
): Promise<string> {
  logger.info('🎨 MOCK: Simulating Runware generation', { taskId });

  // Simulate processing time (adjustable for testing)
  const mockDelay = parseInt(process.env.MOCK_GENERATION_DELAY || '2000', 10);
  await new Promise((resolve) => setTimeout(resolve, mockDelay));

  // Return a random mock image
  const mockImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];

  logger.info('✅ MOCK: Generation complete', { taskId, mockImage });
  return mockImage;
}

// Mock function to simulate errors for testing
export async function generateWithRunwareMockWithError(
  imageBase64: string,
  prompt: string,
  taskId: string
): Promise<string> {
  logger.info('❌ MOCK: Simulating Runware error', { taskId });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  throw new Error('MOCK: Simulated Runware error for testing');
}
