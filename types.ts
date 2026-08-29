/**
 * Represents an automation task in the tool
 */
export interface Task {
  id: string;
  name: string;
  type: 'file' | 'api' | 'script';
  parameters: Record<string, unknown>;
  retries?: number;
}

/**
 * Outcome of a task execution
 */
export interface TaskResult {
  taskId: string;
  success: boolean;
  output: string;
  duration: number;
}

/**
 * Config options for running automations
 */
export interface AutomationConfig {
  maxConcurrent: number;
  timeout: number;
  logLevel: 'info' | 'debug' | 'error';
}

/**
 * Runs automation tasks and collects results
 * @param tasks list of tasks
 * @param config optional config
 * @returns promise of task results
 */
export async function runAutomation(
  tasks: Task[],
  config: AutomationConfig = { maxConcurrent: 5, timeout: 30000, logLevel: 'info' }
): Promise<TaskResult[]> {
  const results: TaskResult[] = [];
  for (const task of tasks) {
    const startTime: number = Date.now();
    let success: boolean = true;
    let output: string = '';
    try {
      if (task.type === 'file') {
        output = `Processed file: ${task.name}`;
      } else if (task.type === 'api') {
        output = `API request completed`;
      } else if (task.type === 'script') {
        output = `Script ran successfully`;
      } else {
        success = false;
        output = 'Invalid type';
      }
      await new Promise<void>(resolve => setTimeout(resolve, 10));
    } catch (err: unknown) {
      success = false;
      output = err instanceof Error ? err.message : String(err);
    }
    const duration: number = Date.now() - startTime;
    results.push({ taskId: task.id, success, output, duration });
  }
  return results;
}
