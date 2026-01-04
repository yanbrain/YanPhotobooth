import type * as functions from 'firebase-functions';
import { getGenerationStatus } from '../services/get-status';
import { handleError } from '../utils/http-errors';
import { logger } from '../utils/logger';

export async function handleStatus(
  req: functions.https.Request,
  res: functions.Response
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
    return;
  }

  try {
    const jobId = req.query.id as string;

    if (!jobId) {
      res.status(400).json({
        error: { code: 'RUNWARE_BAD_INPUT', message: 'Job ID is required' },
      });
      return;
    }

    const job = getGenerationStatus(jobId);

    if (!job) {
      res.status(404).json({
        error: { code: 'RUNWARE_BAD_INPUT', message: 'Job not found' },
      });
      return;
    }

    res.status(200).json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      resultUrl: job.resultUrl,
      error: job.error,
    });
  } catch (error) {
    logger.error('Status endpoint error', error);
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(errorResponse.body);
  }
}
