import fetch from 'node-fetch';
import { env } from '../config/env';
import { RunwareError } from '../domain/errors';
import { logger } from '../lib/logger';
import { generateWithRunwareMock } from './mocks/runware-mock';

interface RunwareImageRequest {
  taskType: 'imageInference';
  taskUUID: string;
  inputImage: string; // base64
  promptText: string;
  height: number;
  width: number;
  numberResults: number;
}

interface RunwareResponse {
  data?: Array<{
    taskUUID: string;
    imageURL?: string;
    error?: string;
  }>;
  error?: string;
}

export async function generateWithRunware(
  imageBase64: string,
  prompt: string,
  taskId: string
): Promise<string> {
  // Use mock in local development
  if (env.useMock) {
    return generateWithRunwareMock(imageBase64, prompt, taskId);
  }
  const apiKey = env.runwareApiKey;

  if (!apiKey) {
    throw new RunwareError('Runware API key not configured', false);
  }

  const request: RunwareImageRequest = {
    taskType: 'imageInference',
    taskUUID: taskId,
    inputImage: imageBase64,
    promptText: prompt,
    height: 1024,
    width: 1024,
    numberResults: 1,
  };

  try {
    logger.info('Calling Runware API', { taskId });

    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      logger.error('Runware API error', { status, text });

      if (status === 429 || status === 503) {
        throw new RunwareError('Service temporarily unavailable', true);
      }

      if (status === 402 || status === 403) {
        throw new RunwareError('Quota exceeded', false);
      }

      throw new RunwareError(`API request failed: ${status}`, status >= 500);
    }

    const data = (await response.json()) as RunwareResponse;

    if (data.error) {
      throw new RunwareError(data.error, false);
    }

    if (!data.data || data.data.length === 0) {
      throw new RunwareError('No image generated', false);
    }

    const result = data.data[0];
    if (result.error) {
      throw new RunwareError(result.error, false);
    }

    if (!result.imageURL) {
      throw new RunwareError('No image URL in response', false);
    }

    logger.info('Runware generation successful', { taskId });
    return result.imageURL;
  } catch (error) {
    if (error instanceof RunwareError) {
      throw error;
    }

    logger.error('Unexpected Runware error', error);
    throw new RunwareError('Failed to generate image', true);
  }
}
