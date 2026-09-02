export interface AutomationConfig {
  port: number;
  host: string;
  debugMode: boolean;
  maxConcurrentTasks: number;
  timeoutMs: number;
  logLevel: 'info' | 'warn' | 'error' | 'debug';
  dataDir: string;
}

const defaultConfig: AutomationConfig = {
  port: 8080,
  host: 'localhost',
  debugMode: false,
  maxConcurrentTasks: 5,
  timeoutMs: 30000,
  logLevel: 'info',
  dataDir: './data'
};

export class ConfigLoader {
  private config: AutomationConfig;

  constructor(customConfig?: Partial<AutomationConfig>) {
    this.config = this.loadConfiguration(customConfig);
  }

  private loadConfiguration(overrides: Partial<AutomationConfig> = {}): AutomationConfig {
    // Merge environment variables with defaults, falling back to provided defaults
    const envConfig: Partial<AutomationConfig> = {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
      host: process.env.HOST,
      debugMode: process.env.DEBUG === 'true' ? true : undefined,
      maxConcurrentTasks: process.env.MAX_TASKS ? parseInt(process.env.MAX_TASKS, 10) : undefined,
      timeoutMs: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT, 10) : undefined,
      logLevel: process.env.LOG_LEVEL as any,
      dataDir: process.env.DATA_DIR
    };

    const filteredEnv: Partial<AutomationConfig> = Object.fromEntries(
      Object.entries(envConfig).filter(([_, v]) => v !== undefined)
    ) as Partial<AutomationConfig>;

    const merged = { ...defaultConfig, ...filteredEnv, ...overrides };

    this.validateConfig(merged);

    return merged;
  }

  private validateConfig(config: AutomationConfig): void {
    if (config.port < 1 || config.port > 65535) {
      throw new Error('Port must be between 1 and 65535');
    }
    if (config.maxConcurrentTasks < 1) {
      throw new Error('maxConcurrentTasks must be at least 1');
    }
    if (config.timeoutMs < 1000) {
      throw new Error('timeoutMs must be at least 1000');
    }
    if (!config.dataDir || config.dataDir.trim() === '') {
      throw new Error('dataDir cannot be empty');
    }
  }

  getConfig(): AutomationConfig {
    return { ...this.config };
  }

  getValue<K extends keyof AutomationConfig>(key: K): AutomationConfig[K] {
    return this.config[key];
  }
}