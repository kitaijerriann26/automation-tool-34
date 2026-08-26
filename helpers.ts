/**
 * Core performance optimization helpers for automation-tool-34.
 * Provides memoization and batch processing for heavy operations.
 */

export interface CacheItem<T> {
  value: T;
  timestamp: number;
}

/**
 * Memoizes synchronous function results with time-to-live (TTL) expiration.
 */
export function memoizeWithTTL<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  ttlMs: number = 5000
): (...args: TArgs) => TReturn {
  const cache = new Map<string, CacheItem<TReturn>>();

  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && now - cached.timestamp < ttlMs) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

/**
 * Processes items in optimized batches to prevent event loop starvation.
 */
export async function processInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 50
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    // Yield control back to the event loop between large batches
    if (i + batchSize < items.length) {
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
  }

  return results;
}
