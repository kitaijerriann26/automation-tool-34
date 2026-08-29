export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay?: number;
}

/**
 * Retries a network operation with exponential backoff
 * @param operation - The async function to retry
 * @param options - Retry configuration
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000 } = options;
  let attempt = 0;
  let lastError: Error | undefined;
  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      attempt++;
      if (attempt > maxRetries) {
        break;
      }
      // Exponential backoff calculation
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt),
        maxDelay
      );
      // Wait for the delay
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

// Additional helper for specific network retries
export async function retryFetch(
  url: string,
  init?: RequestInit,
  options: Partial<RetryOptions> = {}
): Promise<Response> {
  return retryOperation(
    () => fetch(url, init),
    options
  );
}