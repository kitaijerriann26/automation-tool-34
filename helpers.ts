/**
 * Core performance optimization helpers for automation-tool-34.
 * Provides memoization and batch processing utilities.
 */

export interface CacheItem<T> {
  value: T;
  timestamp: number;
}

/**
 * Memoizes synchronous functions to prevent redundant heavy computations.
 */
export function memoize<TArgs extends readonly unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  ttlMs: number = 60000
): (...args: TArgs) => TResult {
  const cache = new Map<string, CacheItem<TResult>>();

  return (...args: TArgs): TResult => {
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
 * Processes an array of items in optimized concurrency batches.
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}
