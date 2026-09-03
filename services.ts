export interface ServiceConfig {
  maxRetries: number;
  backoffMs: number;
}

export interface TaskResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class TaskExecutionService {
  private config: ServiceConfig;

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = {
      maxRetries: config.maxRetries ?? 3,
      backoffMs: config.backoffMs ?? 1000,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executes a task with automatic retries, exponential backoff,
   * and fast-failing for non-recoverable error edge cases.
   */
  public async executeWithRetry<T>(
    task: () => Promise<T>,
    context: string = "generic-task"
  ): Promise<TaskResult<T>> {
    let attempt = 0;

    while (attempt < this.config.maxRetries) {
      try {
        const data = await task();
        return { success: true, data };
      } catch (error: any) {
        attempt++;
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Fail fast on specific edge cases where retry is redundant
        if (errorMessage.includes("Unauthorized") || errorMessage.includes("Validation failed")) {
          return { success: false, error: `Fatal non-retryable error in ${context}: ${errorMessage}` };
        }

        if (attempt >= this.config.maxRetries) {
          return {
            success: false,
            error: `Task execution failed after ${attempt} attempts in ${context}: ${errorMessage}`,
          };
        }

        // Calculate exponential backoff delay
        const backoffDelay = this.config.backoffMs * Math.pow(2, attempt - 1);
        await this.delay(backoffDelay);
      }
    }

    return { success: false, error: `Execution aborted in ${context}` };
  }
}