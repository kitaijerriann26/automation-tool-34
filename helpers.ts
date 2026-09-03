export type Primitive = string | number | boolean | null | undefined;

export interface FlatObject {
  [key: string]: Primitive;
}

/**
 * Flattens a nested object into a single-level object with dot-notated keys.
 */
export function flattenObject(obj: Record<string, any>, prefix = ''): FlatObject {
  const result: FlatObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, newKey));
      } else {
        result[newKey] = value as Primitive;
      }
    }
  }

  return result;
}

/**
 * Unflattens a dot-notated flat object back into a nested structure.
 */
export function unflattenObject(flatObj: FlatObject): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in flatObj) {
    if (Object.prototype.hasOwnProperty.call(flatObj, key)) {
      const parts = key.split('.');
      let current = result;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = flatObj[key];
        } else {
          if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
          }
          current = current[part];
        }
      }
    }
  }

  return result;
}