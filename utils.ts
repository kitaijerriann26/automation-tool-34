export interface ProcessingInput {
  id: string;
  payload: unknown;
  timestamp: number;
}

export function validateInput(input: unknown): input is ProcessingInput {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  const candidate = input as Record<string, unknown>;

  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    return false;
  }

  if (candidate.payload === undefined) {
    return false;
  }

  if (typeof candidate.timestamp !== 'number' || Number.isNaN(candidate.timestamp)) {
    return false;
  }

  return true;
}

export function processInputBatch(inputs: unknown[]): ProcessingInput[] {
  const validInputs: ProcessingInput[] = [];

  for (const item of inputs) {
    if (validateInput(item)) {
      validInputs.push(item);
    } else {
      console.warn('Skipping invalid input item detected in processing loop:', item);
    }
  }

  return validInputs;
}