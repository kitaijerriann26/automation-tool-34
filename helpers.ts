export interface ProcessInput {
  id: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

/**
 * validates structure and data integrity of input objects
 */
export function isValidInput(input: unknown): input is ProcessInput {
  if (typeof input !== 'object' || input === null) return false;

  const { id, payload, timestamp } = input as Partial<ProcessInput>;

  return (
    typeof id === 'string' &&
    id.length > 0 &&
    typeof payload === 'object' &&
    payload !== null &&
    typeof timestamp === 'number' &&
    !isNaN(timestamp)
  );
}

/**
 * main loop validator for processing stream
 */
export function validateAndProcess(items: unknown[], processor: (item: ProcessInput) => void): void {
  for (const item of items) {
    if (isValidInput(item)) {
      try {
        processor(item);
      } catch (err) {
        console.error(`processing error for item ${item.id}:`, err);
      }
    } else {
      console.warn('skipping invalid input item:', item);
    }
  }
}