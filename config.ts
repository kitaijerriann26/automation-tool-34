export interface AppConfig {
  port: number;
  host: string;
  timeout: number;
  debug: boolean;
}

const DEFAULT_CONFIG: AppConfig = {
  port: 3000,
  host: 'localhost',
  timeout: 5000,
  debug: false,
};

/**
 * Merges user settings with system defaults
 */
export function loadConfig(userConfig: Partial<AppConfig> = {}): AppConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
}

/**
 * Factory for typed configuration objects
 */
export const getConfiguration = (overrides?: Partial<AppConfig>): AppConfig => {
  const config = loadConfig(overrides);
  
  if (config.port < 1024) {
    throw new Error('Port must be above 1024');
  }

  return config;
};