import type * as functions from 'firebase-functions';
import Busboy from 'busboy';
import { generatePortrait } from '../usecases/generate-portrait';
import { handleError } from '../lib/http-errors';
import { logger } from '../lib/logger';

interface GenerateFields {
  styleId?: string;
  idempotencyKey?: string;
  botToken?: string;
}

export async function handleGenerate(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
    return;
  }

  try {
    const { imageBuffer, fields } = await parseMultipartForm(req);

    if (!imageBuffer) {
      res.status(400).json({
        error: { code: 'RUNWARE_BAD_INPUT', message: 'Image is required' },
      });
      return;
    }

    if (!fields.styleId || !fields.idempotencyKey || !fields.botToken) {
      res.status(400).json({
        error: { code: 'RUNWARE_BAD_INPUT', message: 'Missing required fields' },
      });
      return;
    }

    const clientIp = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';

    const job = await generatePortrait(
      imageBuffer,
      fields.styleId,
      fields.idempotencyKey,
      fields.botToken,
      clientIp
    );

    res.status(200).json({
      jobId: job.id,
      status: job.status,
      resultUrl: job.resultUrl,
      error: job.error,
    });
  } catch (error) {
    logger.error('Generate endpoint error', error);
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(errorResponse.body);
  }
}

function parseMultipartForm(
  req: functions.https.Request
): Promise<{ imageBuffer: Buffer | null; fields: GenerateFields }> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    let imageBuffer: Buffer | null = null;
    const fields: GenerateFields = {};

    busboy.on('file', (fieldname, file, info) => {
      if (fieldname === 'image') {
        const chunks: Buffer[] = [];
        file.on('data', (chunk) => chunks.push(chunk));
        file.on('end', () => {
          imageBuffer = Buffer.concat(chunks);
        });
      } else {
        file.resume();
      }
    });

    busboy.on('field', (fieldname, value) => {
      if (fieldname === 'styleId' || fieldname === 'idempotencyKey' || fieldname === 'botToken') {
        fields[fieldname] = value;
      }
    });

    busboy.on('finish', () => {
      resolve({ imageBuffer, fields });
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    req.pipe(busboy);
  });
}
