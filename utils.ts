export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry an async operation with exponential backoff
export async function retryOperation<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 500
): Promise<T> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

export function logMessage(message: string, level: string = 'info'): void {
  const timestamp = new Date().toISOString();
  const prefix = level.toUpperCase();
  console.log(`[${prefix}] ${timestamp}: ${message}`);
}

export function createBatchProcessor<T, R>(
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
) {
  return async (items: T[]): Promise<R[]> => {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      results.push(...batchResults);
    }
    return results;
  };
}

export function validateConfig(config: Record<string, unknown>): boolean {
  if (!config || typeof config !== 'object') {
    return false;
  }
  const requiredKeys = ['timeout', 'retries'];
  return requiredKeys.every(key => key in config);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}