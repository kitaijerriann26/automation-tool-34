interface Config {
  apiUrl: string;
  timeout: number;
  maxRetries: number;
  logLevel: string;
}

const DEFAULT_CONFIG: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  maxRetries: 3,
  logLevel: "info"
};

export class ConfigLoader {
  private config: Config;
  constructor(overrides: Partial<Config> = {}) {
    // Start with defaults and apply any initial overrides
    this.config = { ...DEFAULT_CONFIG, ...overrides };
  }

  getConfig(): Config {
    return { ...this.config };
  }

  loadWithOverrides(overrides: Partial<Config>): Config {
    // Merge current config with new overrides
    this.config = { ...this.config, ...overrides };
    return this.getConfig();
  }

  loadFromEnv(): Config {
    const env: Partial<Config> = {};
    // Load from environment variables if present
    if (process.env.API_URL) {
      env.apiUrl = process.env.API_URL;
    }
    if (process.env.TIMEOUT) {
      const t = parseInt(process.env.TIMEOUT, 10);
      if (!isNaN(t) && t > 0) {
        env.timeout = t;
      }
    }
    if (process.env.MAX_RETRIES) {
      const r = parseInt(process.env.MAX_RETRIES, 10);
      if (!isNaN(r) && r >= 0) {
        env.maxRetries = r;
      }
    }
    if (process.env.LOG_LEVEL) {
      env.logLevel = process.env.LOG_LEVEL;
    }
    return this.loadWithOverrides(env);
  }
}

export function createConfigLoader(initial?: Partial<Config>): ConfigLoader {
  return new ConfigLoader(initial);
}