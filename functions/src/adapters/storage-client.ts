import * as admin from 'firebase-admin';
import { logger } from '../lib/logger';
import { env } from '../config/env';
import { uploadImageMock, downloadImageAsBase64Mock } from './mocks/storage-mock';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const storage = admin.storage();

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  // Use mock in local development
  if (env.useMock) {
    return uploadImageMock(buffer, filename, contentType);
  }
  try {
    const bucket = storage.bucket();
    const file = bucket.file(`generated/${filename}`);

    await file.save(buffer, {
      metadata: {
        contentType,
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    logger.info('Image uploaded to storage', { filename, url: publicUrl });

    return publicUrl;
  } catch (error) {
    logger.error('Storage upload failed', error);
    throw new Error('Failed to upload image to storage');
  }
}

export async function downloadImageAsBase64(url: string): Promise<string> {
  // Use mock in local development
  if (env.useMock) {
    return downloadImageAsBase64Mock(url);
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    return buffer.toString('base64');
  } catch (error) {
    logger.error('Failed to download image', error);
    throw new Error('Failed to download image');
  }
}
