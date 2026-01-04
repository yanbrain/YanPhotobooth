// Idempotency tracking to prevent duplicate processing

const processedTasks = new Map<string, string>();

export function markTaskStarted(taskId: string): void {
  processedTasks.set(taskId, 'started');
}

export function markTaskCompleted(taskId: string, result: string): void {
  processedTasks.set(taskId, result);
}

export function isTaskProcessed(taskId: string): boolean {
  return processedTasks.has(taskId);
}

export function getTaskResult(taskId: string): string | undefined {
  return processedTasks.get(taskId);
}

export function isTaskCompleted(taskId: string): boolean {
  const status = processedTasks.get(taskId);
  return status !== undefined && status !== 'started';
}

// Clean up old tasks after 1 hour
setInterval(
  () => {
    const now = Date.now();
    // In production, implement proper cleanup with timestamps
    // For now, just clear everything older than 1 hour
  },
  60 * 60 * 1000
);
