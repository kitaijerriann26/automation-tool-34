export interface AutomationTask {
  id: string;
  type: string;
  payload: Record<string, any>;
  retries: number;
}

export class TaskQueue {
  private queue: AutomationTask[] = [];
  private maxRetries = 3;

  addTask(task: AutomationTask): void {
    if (!task.id || !task.type) {
      throw new Error('Invalid task');
    }
    this.queue.push(task);
  }

  processQueue(): void {
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.executeTask(task);
    }
  }

  private executeTask(task: AutomationTask): void {
    // attempt execution with retry logic
    let attempts = 0;
    while (attempts < task.retries && attempts < this.maxRetries) {
      try {
        console.log(`Processing task ${task.id} of type ${task.type}`);
        if (task.type === 'file') {
          this.handleFileTask(task.payload);
        } else if (task.type === 'api') {
          this.handleApiTask(task.payload);
        }
        return;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed for ${task.id}`);
      }
    }
    console.error(`Task ${task.id} failed after retries`);
  }

  private handleFileTask(payload: Record<string, any>): void {
    console.log(`Handling file: ${payload.path || 'unknown'}`);
  }

  private handleApiTask(payload: Record<string, any>): void {
    console.log(`Calling API: ${payload.endpoint || 'unknown'}`);
  }
}

export class ConfigService {
  private config: Record<string, any> = {
    timeout: 5000,
    logLevel: 'info'
  };

  get(key: string): any {
    return this.config[key];
  }

  set(key: string, value: any): void {
    this.config[key] = value;
  }
}