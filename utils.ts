export interface DataOptions {
  maxDepth?: number;
  sanitize?: boolean;
}

/**
 * Recursively processes data for general handling tasks.
 * Supports objects, arrays, and primitives.
 */
export function handleData<T>(
  data: T,
  options: DataOptions = {}
): T {
  const { maxDepth = 5, sanitize = false } = options;
  return processRecursive(data, maxDepth, sanitize);
}

function processRecursive(
  item: any,
  depth: number,
  sanitize: boolean
): any {
  if (depth <= 0 || item === null || item === undefined) {
    return item;
  }
  if (typeof item !== 'object') {
    if (sanitize && typeof item === 'string') {
      return item.trim();
    }
    return item;
  }
  if (Array.isArray(item)) {
    return item.map((elem) => processRecursive(elem, depth - 1, sanitize));
  }
  const result: { [key: string]: any } = {};
  for (const key of Object.keys(item)) {
    result[key] = processRecursive(item[key], depth - 1, sanitize);
  }
  return result;
}

/**
 * Merges two data objects deeply for general use.
 */
export function mergeData<T extends object, U extends object>(
  base: T,
  override: U
): T & U {
  const result = handleData(base) as T & U;
  const overrideProcessed = handleData(override);
  for (const key of Object.keys(overrideProcessed)) {
    if (
      typeof overrideProcessed[key] === 'object' &&
      overrideProcessed[key] !== null &&
      !Array.isArray(overrideProcessed[key])
    ) {
      (result as any)[key] = mergeData(
        (result as any)[key] || {},
        overrideProcessed[key]
      );
    } else {
      (result as any)[key] = overrideProcessed[key];
    }
  }
  return result;
}