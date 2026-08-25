export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryOperation<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 500
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await delay(retryDelay);
    }
  }
  throw new Error('Retry failed');
}

export function parseJsonSafely<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function validateConfig(config: Record<string, any>): boolean {
  return config && typeof config === 'object' && !Array.isArray(config);
}

export function processBatch<T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 10
): R[] {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = batch.map(processor);
    results.push(...batchResults);
  }
  return results;
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Helper for merging config objects after reorganization
export function mergeObjects<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = mergeObjects(result[key] || ({} as any), value as any);
      } else {
        result[key] = value as any;
      }
    }
  }
  return result;
}