/**
 * Pauses execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RetryOptions {
  retries: number;
  delayMs: number;
  backoffMultiplier?: number;
}

/**
 * Retries an asynchronous operation with exponential backoff.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { retries, delayMs, backoffMultiplier = 2 } = options;
  let currentAttempt = 0;

  while (currentAttempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      currentAttempt++;
      if (currentAttempt > retries) {
        throw new Error(`Operation failed after ${retries} attempts: ${(error as Error).message}`);
      }
      const waitTime = delayMs * Math.pow(backoffMultiplier, currentAttempt - 1);
      await delay(waitTime);
    }
  }
  throw new Error("Unreachable state in retry helper");
}

/**
 * Safely parses a string value into a boolean.
 */
export function parseBoolean(val: string | boolean | undefined): boolean {
  if (typeof val === "boolean") return val;
  if (!val) return false;
  const normalized = val.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}