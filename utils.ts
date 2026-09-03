export interface TaskInput {
  id: string;
  action: string;
  payload: Record<string, unknown>;
  retryCount?: number;
  timeoutMs?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ProcessedItem {
  id: string;
  status: 'success' | 'invalid' | 'failed';
  data?: unknown;
  errors?: string[];
}

export function validateTaskInput(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input must be a non-null object'] };
  }

  const task = input as Partial<TaskInput>;

  if (!task.id || typeof task.id !== 'string' || task.id.trim() === '') {
    errors.push('Task id is required and must be a non-empty string');
  }

  if (!task.action || typeof task.action !== 'string') {
    errors.push('Task action is required and must be a string');
  }

  if (!task.payload || typeof task.payload !== 'object' || Array.isArray(task.payload)) {
    errors.push('Task payload must be a valid key-value object');
  }

  if (task.retryCount !== undefined && (typeof task.retryCount !== 'number' || task.retryCount < 0)) {
    errors.push('retryCount must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function processBatchLoop(rawTasks: unknown[]): ProcessedItem[] {
  const results: ProcessedItem[] = [];

  for (const rawTask of rawTasks) {
    const validation = validateTaskInput(rawTask);

    if (!validation.valid) {
      const fallbackId = (rawTask as Record<string, unknown>)?.id;
      results.push({
        id: typeof fallbackId === 'string' ? fallbackId : 'unknown',
        status: 'invalid',
        errors: validation.errors,
      });
      continue;
    }

    const task = rawTask as TaskInput;
    try {
      results.push({
        id: task.id,
        status: 'success',
        data: { processedAction: task.action, timestamp: Date.now() },
      });
    } catch (err) {
      results.push({
        id: task.id,
        status: 'failed',
        errors: [(err as Error).message || 'Execution failed'],
      });
    }
  }

  return results;
}