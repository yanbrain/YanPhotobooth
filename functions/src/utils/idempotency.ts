/**
 * Idempotency key tracking to prevent duplicate job creation
 * Maps idempotency keys to job IDs for deduplication
 */

const idempotencyMap = new Map<string, string>();

export function getJobForIdempotencyKey(key: string): string | undefined {
  return idempotencyMap.get(key);
}

export function setJobForIdempotencyKey(key: string, jobId: string): void {
  idempotencyMap.set(key, jobId);
}
