// Environment configuration

export const env = {
  runwareApiKey: process.env.RUNWARE_API_KEY || '',
  dailyMaxGenerations: parseInt(process.env.DAILY_MAX_GENERATIONS || '1000', 10),
  emailProvider: process.env.EMAIL_PROVIDER || 'sendgrid',
  emailApiKey: process.env.EMAIL_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@yanphotobooth.com',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
} as const;

export function validateEnv(): void {
  const errors: string[] = [];

  if (!env.runwareApiKey) {
    errors.push('RUNWARE_API_KEY is required');
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}
