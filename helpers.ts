export interface RetryOptions {
  retries?: number;
  delay?: number;
  factor?: number;
  exponential?: boolean;
  onRetry?: (error: any, attempt: number) => void;
}

/**
 * Executes an asynchronous operation and retries it if it fails.
 * Uses optional exponential backoff to prevent overwhelming external services.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    factor = 2,
    exponential = true,
    onRetry,
  } = options;

  let lastError: any;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt > retries) {
        break;
      }

      if (onRetry) {
        onRetry(error, attempt);
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay));

      if (exponential) {
        currentDelay *= factor;
      }
    }
  }

  throw lastError;
}