export interface AutomationTask {
  id: number;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  enabled: boolean;
}

/**
 * Configuration for automation tool
 */
export interface ToolConfig {
  maxRetries: number;
  timeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  tasks: AutomationTask[];
}

export interface TaskResult {
  taskId: number;
  success: boolean;
  message: string;
  duration: number;
}

/**
 * Run enabled tasks from config
 * @param config tool config
 * @returns array of results
 */
export async function executeTasks(config: ToolConfig): Promise<TaskResult[]> {
  const results: TaskResult[] = [];
  for (const task of config.tasks) {
    if (!task.enabled) continue;
    const startTime = Date.now();
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      results.push({ taskId: task.id, success: true, message: `Task ${task.name} done`, duration: Date.now() - startTime });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'error';
      results.push({ taskId: task.id, success: false, message: errMsg, duration: Date.now() - startTime });
    }
  }
  return results;
}

/**
 * Validate tool config
 * @param config the config
 * @returns true if valid
 */
export function isValidConfig(config: ToolConfig): boolean {
  return config.maxRetries >= 0 && config.timeout >= 100 && config.tasks.length > 0;
}