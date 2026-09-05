export interface TaskInput {
  id: string;
  action: string;
  payload: Record<string, unknown>;
  priority?: number;
  timeoutMs?: number;
}

export interface ProcessingResult {
  processedCount: number;
  failedCount: number;
  errors: string[];
}

export function validateTaskInput(input: unknown): input is TaskInput {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  const candidate = input as Record<string, unknown>;

  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    return false;
  }

  if (typeof candidate.action !== 'string' || candidate.action.trim() === '') {
    return false;
  }

  if (typeof candidate.payload !== 'object' || candidate.payload === null) {
    return false;
  }

  if (candidate.priority !== undefined && typeof candidate.priority !== 'number') {
    return false;
  }

  if (
    candidate.timeoutMs !== undefined &&
    (typeof candidate.timeoutMs !== 'number' || candidate.timeoutMs <= 0)
  ) {
    return false;
  }

  return true;
}

export async function processTaskQueue(rawTasks: unknown[]): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    processedCount: 0,
    failedCount: 0,
    errors: [],
  };

  for (let i = 0; i < rawTasks.length; i++) {
    const rawTask = rawTasks[i];

    if (!validateTaskInput(rawTask)) {
      result.failedCount++;
      result.errors.push(`Task at index ${i} failed validation: invalid structure`);
      continue;
    }

    try {
      await executeTask(rawTask);
      result.processedCount++;
    } catch (err) {
      result.failedCount++;
      const message = err instanceof Error ? err.message : String(err);
      result.errors.push(`Task ${rawTask.id} execution failed: ${message}`);
    }
  }

  return result;
}

async function executeTask(task: TaskInput): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, task.timeoutMs || 10));
}