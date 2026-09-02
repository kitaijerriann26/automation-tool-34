export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

// Performs a network operation with retry logic using exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 30000;
  const backoffMultiplier = options.backoffMultiplier ?? 2;
  let currentDelay = initialDelayMs;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) {
        throw err;
      }
      // Apply delay before next retry
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      // Exponential backoff
      currentDelay = Math.min(
        currentDelay * backoffMultiplier,
        maxDelayMs
      );
    }
  }
  // This should never be reached
  throw new Error("Unexpected end of retry loop");
}

// Wraps the fetch API with retry capability
// Retries on server errors (5xx)
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  retryOpts?: RetryOptions
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, init);
    if (response.status >= 500) {
      throw new Error(`HTTP ${response.status} error`);
    }
    return response;
  }, retryOpts);
}