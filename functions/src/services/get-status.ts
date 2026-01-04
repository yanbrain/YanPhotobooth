import { getJobStatus } from './generate-portrait';
import type { GenerationJob } from '../domain/types';

export function getGenerationStatus(jobId: string): GenerationJob | null {
  return getJobStatus(jobId);
}
