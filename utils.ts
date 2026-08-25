// Utility functions for automation tool input handling

export interface ValidatedInput {
  id: number;
  name: string;
  value: number;
  timestamp: Date;
}

export function validateInput(raw: unknown): ValidatedInput | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== 'number' || obj.id <= 0) {
    return null;
  }

  if (typeof obj.name !== 'string' || obj.name.trim().length === 0) {
    return null;
  }

  if (typeof obj.value !== 'number' || isNaN(obj.value)) {
    return null;
  }

  if (typeof obj.timestamp !== 'string') {
    return null;
  }

  const parsedDate = new Date(obj.timestamp);
  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    id: obj.id,
    name: obj.name.trim(),
    value: obj.value,
    timestamp: parsedDate
  };
}

export function runProcessingLoop(rawInputs: unknown[]): void {
  // Main processing loop
  for (const rawInput of rawInputs) {
    const validated = validateInput(rawInput);
    if (validated !== null) {
      // Process the valid input
      console.log(`Processing ${validated.name} with value ${validated.value}`);
      // Example processing step
      const processedValue = validated.value * 1.1;
      console.log(`Processed value: ${processedValue}`);
    } else {
      console.error('Invalid input detected, skipping');
    }
  }
}

// Sample data to demonstrate the loop
const sampleData: unknown[] = [
  { id: 101, name: 'itemA', value: 25, timestamp: '2023-10-01T12:00:00Z' },
  { id: -5, name: 'bad', value: 10, timestamp: '2023-10-01' }, // invalid id
  { id: 102, name: '', value: 30, timestamp: '2023-10-02T12:00:00Z' }, // invalid name
  { id: 103, name: 'itemB', value: 'notnum', timestamp: '2023-10-03T12:00:00Z' }, // invalid value
  { id: 104, name: 'itemC', value: 40, timestamp: 'invalid-date' } // invalid timestamp
];

runProcessingLoop(sampleData);