import type * as functions from 'firebase-functions';
import { sendGeneratedEmail } from '../usecases/send-email';
import { handleError } from '../lib/http-errors';
import { logger } from '../lib/logger';

interface EmailRequest {
  jobId: string;
  email: string;
  botToken: string;
}

export async function handleEmail(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
    return;
  }

  try {
    const body = req.body as EmailRequest;

    if (!body.jobId || !body.email || !body.botToken) {
      res.status(400).json({
        error: { code: 'EMAIL_BLOCKED', message: 'Missing required fields' },
      });
      return;
    }

    const clientIp = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';

    await sendGeneratedEmail(body.jobId, body.email, body.botToken, clientIp);

    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error('Email endpoint error', error);
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(errorResponse.body);
  }
}
