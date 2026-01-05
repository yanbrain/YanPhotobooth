// Environment configuration

export const env = {
  // Development mode - use mocks instead of real APIs
  useMock: process.env.USE_MOCK === 'true',

  // API keys
  runwareApiKey: process.env.RUNWARE_API_KEY || '',
  emailProvider: process.env.EMAIL_PROVIDER || 'sendgrid',
  emailApiKey: process.env.EMAIL_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@yanphotobooth.com',

  // Firebase
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',

  // Rate limiting
  dailyMaxGenerations: parseInt(process.env.DAILY_MAX_GENERATIONS || '1000', 10),

  // Mock delays (milliseconds) - customize for testing
  mockGenerationDelay: parseInt(process.env.MOCK_GENERATION_DELAY || '2000', 10),
  mockEmailDelay: parseInt(process.env.MOCK_EMAIL_DELAY || '500', 10),
  mockStorageDelay: parseInt(process.env.MOCK_STORAGE_DELAY || '300', 10),
} as const;

export function validateEnv(): void {
  const errors: string[] = [];

  // In mock mode, API keys are not required
  if (!env.useMock) {
    if (!env.runwareApiKey) {
      errors.push('RUNWARE_API_KEY is required (or set USE_MOCK=true for local development)');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}
