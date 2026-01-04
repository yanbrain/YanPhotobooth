import { httpClient, HttpError } from '@/shared/api/http-client';
import type { EmailRequest, EmailResponse } from '@/shared/types/api-types';

export async function sendEmail(jobId: string, email: string): Promise<EmailResponse> {
  try {
    const request: EmailRequest = {
      jobId,
      email,
      botToken: 'placeholder', // TODO: Implement bot check
    };

    const response = await httpClient.post<EmailResponse>('/email', request);
    return response;
  } catch (error) {
    if (error instanceof HttpError && error.error) {
      throw new Error(error.error.message);
    }
    throw new Error('Failed to send email');
  }
}
