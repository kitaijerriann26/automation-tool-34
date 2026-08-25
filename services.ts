export interface Task {
  id: number;
  data: string;
}

export interface ProcessedResult {
  id: number;
  result: string;
  timestamp: number;
}

export class CoreService {
  private cache: Map<string, ProcessedResult[]> = new Map();
  private cacheLimit: number = 50;

  /**
   * Processes automation tasks with caching for better performance
   * Avoids recomputing identical task sets
   */
  processAutomationTasks(tasks: Task[]): ProcessedResult[] {
    if (!tasks || tasks.length === 0) {
      return [];
    }

    const key = this.createCacheKey(tasks);
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const results: ProcessedResult[] = [];
    for (const task of tasks) {
      // Practical processing step
      const processedData = task.data.trim().toLowerCase();
      results.push({
        id: task.id,
        result: processedData + '_' + Date.now(),
        timestamp: Date.now()
      });
    }

    // Manage cache size for memory optimization
    if (this.cache.size >= this.cacheLimit) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, results);
    return results;
  }

  private createCacheKey(tasks: Task[]): string {
    // Efficient key generation using sorted ids
    return tasks
      .map((t) => t.id)
      .sort((a, b) => a - b)
      .join(',');
  }

  // Additional helper for clearing cache if needed
  clearCache(): void {
    this.cache.clear();
  }
}