// Utility for retrying network operations with exponential backoff
// Suitable for flaky network calls in automation-tool-34

interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay in milliseconds */
  baseDelay: number;
  /** Maximum delay to cap at */
  maxDelay: number;
  /** Function to determine if error is retryable */
  isRetryable: (error: unknown) => boolean;
}

function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  return Math.min(exponentialDelay, maxDelay);
}

const defaultIsRetryable = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Retry on common network issues
    const msg = error.message.toLowerCase();
    return msg.includes('timeout') ||
           msg.includes('network') ||
           msg.includes('econnreset') ||
           msg.includes('fetch failed');
  }
  return true;
};

export async function withNetworkRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const finalOptions: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    isRetryable: defaultIsRetryable,
    ...options
  };

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= finalOptions.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === finalOptions.maxRetries || !finalOptions.isRetryable(error)) {
        throw error;
      }

      const delay = calculateDelay(attempt, finalOptions.baseDelay, finalOptions.maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError as Error;
}