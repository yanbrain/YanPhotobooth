// Public environment variables (safe for client)

export const publicEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  // Add Firebase App Check site key when ready
  appCheckSiteKey: process.env.NEXT_PUBLIC_APP_CHECK_SITE_KEY || '',
} as const;
