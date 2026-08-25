// Helper utilities for automation-tool-34
// Provides reusable functions for delays, retries, and logging

export interface TaskConfig {
  maxRetries: number;
  timeoutMs: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Creates a promise that resolves after the given delay
export function createDelay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Retries an async operation with configurable max attempts
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        await createDelay(1000 * (attempt + 1));
      }
    }
  }
  throw lastError || new Error('Operation failed after retries');
}

// Formats log entry with current timestamp
export function formatLogMessage(message: string, level: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

// Outputs formatted message to console
export function log(message: string, level: TaskConfig['logLevel'] = 'info'): void {
  const formatted = formatLogMessage(message, level);
  if (level === 'error' || level === 'warn') {
    console.error(formatted);
  } else {
    console.log(formatted);
  }
}

// Provides methods to execute tasks with configured retry logic
export class AutomationHelpers {
  private config: TaskConfig;

  constructor(config: TaskConfig) {
    this.config = config;
  }

  async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    return withRetry(fn, this.config.maxRetries);
  }

  getTimeout(): number {
    return this.config.timeoutMs;
  }

  logInfo(message: string): void {
    log(message, 'info');
  }
}