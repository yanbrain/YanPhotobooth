import type { GenerationJob } from '../domain/types';
import { validateStyleId, validateIdempotencyKey } from '../domain/validators';
import { DailyCapError, DomainError } from '../domain/errors';
import { generateWithRunware } from '../adapters/runware-client';
import { uploadImage } from '../adapters/storage-client';
import { checkRateLimit } from '../adapters/rate-limiter';
import { verifyBotToken } from '../adapters/bot-check';
import {
  getJobForIdempotencyKey,
  setJobForIdempotencyKey,
} from '../utils/idempotency';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { getPromptForStyle } from '../config/prompts';

// In-memory job store (would use Firestore in production)
const jobStore = new Map<string, GenerationJob>();

// Daily counter (would use Firestore in production)
let dailyCount = 0;
let dailyResetTime = Date.now() + 24 * 60 * 60 * 1000;

function checkDailyLimit(): void {
  const now = Date.now();

  if (now > dailyResetTime) {
    dailyCount = 0;
    dailyResetTime = now + 24 * 60 * 60 * 1000;
  }

  if (dailyCount >= env.dailyMaxGenerations) {
    throw new DailyCapError();
  }

  dailyCount++;
}

export async function generatePortrait(
  imageBuffer: Buffer,
  styleId: string,
  idempotencyKey: string,
  botToken: string,
  clientIp: string
): Promise<GenerationJob> {
  // Validate inputs
  if (!validateStyleId(styleId)) {
    throw new DomainError('RUNWARE_BAD_INPUT', `Invalid style ID: ${styleId}`);
  }

  if (!validateIdempotencyKey(idempotencyKey)) {
    throw new DomainError('RUNWARE_BAD_INPUT', 'Invalid idempotency key');
  }

  // Check idempotency
  const existingJobId = getJobForIdempotencyKey(idempotencyKey);
  if (existingJobId) {
    const existingJob = jobStore.get(existingJobId);
    if (existingJob) {
      logger.info('Returning existing job for idempotency key', { jobId: existingJobId });
      return existingJob;
    }
  }

  // Bot check
  verifyBotToken(botToken);

  // Rate limit
  checkRateLimit(clientIp, 10, 60 * 1000);

  // Daily cap
  checkDailyLimit();

  // Create job
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  const job: GenerationJob = {
    id: jobId,
    idempotencyKey,
    styleId,
    status: 'queued',
    progress: 0,
    imageUrl: null,
    resultUrl: null,
    error: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  jobStore.set(jobId, job);
  setJobForIdempotencyKey(idempotencyKey, jobId);

  logger.info('Created generation job', { jobId, styleId });

  // Start async generation (non-blocking)
  processGeneration(jobId, imageBuffer, styleId).catch((error) => {
    logger.error('Generation processing failed', { jobId, error });
  });

  return job;
}

async function processGeneration(
  jobId: string,
  imageBuffer: Buffer,
  styleId: string
): Promise<void> {
  const job = jobStore.get(jobId);
  if (!job) return;

  try {
    // Update status to running
    job.status = 'running';
    job.progress = 10;
    job.updatedAt = Date.now();
    jobStore.set(jobId, job);

    // Upload original image
    const imageUrl = await uploadImage(
      imageBuffer,
      `input_${jobId}.jpg`,
      'image/jpeg'
    );

    job.imageUrl = imageUrl;
    job.progress = 30;
    job.updatedAt = Date.now();
    jobStore.set(jobId, job);

    const prompt = getPromptForStyle(styleId);

    job.progress = 50;
    job.updatedAt = Date.now();
    jobStore.set(jobId, job);

    // Generate with Runware
    const imageBase64 = imageBuffer.toString('base64');
    const resultImageUrl = await generateWithRunware(imageBase64, prompt, jobId);

    job.progress = 90;
    job.updatedAt = Date.now();
    jobStore.set(jobId, job);

    // Download and re-upload to our storage
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(resultImageUrl);
    const resultBuffer = await response.buffer();

    const finalUrl = await uploadImage(
      resultBuffer,
      `result_${jobId}.jpg`,
      'image/jpeg'
    );

    // Mark as done
    job.status = 'done';
    job.progress = 100;
    job.resultUrl = finalUrl;
    job.updatedAt = Date.now();
    jobStore.set(jobId, job);

    logger.info('Generation completed', { jobId });
  } catch (error) {
    logger.error('Generation failed', { jobId, error });

    job.status = 'failed';
    if (error instanceof DomainError) {
      job.error = error.toResponse();
    } else {
      job.error = {
        code: 'UNKNOWN_ERROR',
        message: 'Generation failed',
      };
    }
    job.updatedAt = Date.now();
    jobStore.set(jobId, job);
  }
}

export function getJobStatus(jobId: string): GenerationJob | null {
  return jobStore.get(jobId) || null;
}
