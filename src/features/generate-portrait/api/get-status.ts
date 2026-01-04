import { httpClient, HttpError } from '@/shared/api/http-client';
import type { StatusResponse } from '@/shared/types/api-types';
import { GenerationError } from '../lib/generation-errors';

export async function getStatus(jobId: string): Promise<StatusResponse> {
  try {
    const response = await httpClient.get<StatusResponse>(`/status?id=${jobId}`);
    return response;
  } catch (error) {
    if (error instanceof HttpError && error.error) {
      throw new GenerationError(error.error.code, error.error.message);
    }
    throw new GenerationError('UNKNOWN_ERROR', 'Failed to get generation status');
  }
}
