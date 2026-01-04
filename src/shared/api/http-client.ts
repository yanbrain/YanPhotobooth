import { publicEnv } from '../config/public-env';
import type { ApiError } from '../types/api-types';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public error: ApiError | null,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let error: ApiError | null = null;
    try {
      const data = await response.json();
      error = data.error || null;
    } catch {
      // Could not parse error
    }

    throw new HttpError(
      response.status,
      error,
      error?.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

export const httpClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${publicEnv.apiBaseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<T>(response);
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${publicEnv.apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  },

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const response = await fetch(`${publicEnv.apiBaseUrl}${path}`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse<T>(response);
  },
};
