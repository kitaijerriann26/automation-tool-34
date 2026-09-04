import { EventEmitter } from 'events';

interface Task {
  id: string;
  execute: () => Promise<void>;
}

/**
 * Optimized task processor with concurrency limit and cache
 */
export class TaskProcessor extends EventEmitter {
  private queue: Task[] = [];
  private activeCount = 0;
  private cache = new Map<string, any>();

  constructor(private concurrencyLimit: number = 3) {
    super();
  }

  public addTask(task: Task): void {
    this.queue.push(task);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.activeCount >= this.concurrencyLimit || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift()!;
    this.activeCount++;

    try {
      if (this.cache.has(task.id)) {
        return;
      }

      await task.execute();
      this.cache.set(task.id, true);
    } catch (err) {
      this.emit('error', err);
    } finally {
      this.activeCount--;
      this.process();
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}