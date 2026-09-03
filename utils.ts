/**
 * Utility function to perform a deep merge of two objects.
 * Useful for combining default options with user configurations.
 */

interface MergeOptions {
  concatArrays?: boolean;
}

type GenericObject = Record<string, any>;

/**
 * Helper to identify if an item is a plain object.
 */
function isObject(item: any): item is GenericObject {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Recursively merges source object into target object.
 * Returns a new merged object without mutating the originals.
 */
export function deepMerge(
  target: GenericObject,
  source: GenericObject,
  options: MergeOptions = { concatArrays: false }
): GenericObject {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (isObject(sourceValue)) {
        if (key in target) {
          output[key] = deepMerge(targetValue, sourceValue, options);
        } else {
          output[key] = { ...sourceValue };
        }
      } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        output[key] = options.concatArrays
          ? [...targetValue, ...sourceValue]
          : [...sourceValue];
      } else if (sourceValue !== undefined) {
        output[key] = sourceValue;
      }
    });
  }

  return output;
}
