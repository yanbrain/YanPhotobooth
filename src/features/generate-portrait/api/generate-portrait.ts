import { httpClient, HttpError } from '@/shared/api/http-client';
import type { GenerateResponse } from '@/shared/types/api-types';
import { GenerationError } from '../lib/generation-errors';

export async function generatePortrait(
  image: Blob,
  styleId: string,
  idempotencyKey: string
): Promise<GenerateResponse> {
  try {
    const formData = new FormData();
    formData.append('image', image, 'photo.jpg');
    formData.append('styleId', styleId);
    formData.append('idempotencyKey', idempotencyKey);
    formData.append('botToken', 'placeholder'); // TODO: Implement bot check

    const response = await httpClient.postFormData<GenerateResponse>(
      '/generate',
      formData
    );

    return response;
  } catch (error) {
    if (error instanceof HttpError && error.error) {
      throw new GenerationError(error.error.code, error.error.message);
    }
    throw new GenerationError('UNKNOWN_ERROR', 'Failed to generate portrait');
  }
}
