import { RateLimitError } from '../domain/errors';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60 * 1000 // 1 minute
): void {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Create new entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (entry.count >= maxRequests) {
    throw new RateLimitError();
  }

  entry.count++;
  rateLimitStore.set(identifier, entry);
}
