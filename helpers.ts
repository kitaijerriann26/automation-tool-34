export interface Config {
  endpoint: string;
  timeout: number;
  retries: number;
  verbose: boolean;
}

const defaults: Config = {
  endpoint: 'http://localhost:3000',
  timeout: 5000,
  retries: 3,
  verbose: false,
};

export function loadConfig(userConfig: Partial<Config> = {}): Config {
  const config: Config = {
    ...defaults,
    ...userConfig,
  };

  // Ensure positive values for timeout and retries
  if (config.timeout <= 0) {
    config.timeout = defaults.timeout;
  }

  if (config.retries < 0) {
    config.retries = defaults.retries;
  }

  return config;
}

export function createCustomLoader(customDefaults: Partial<Config> = {}) {
  const mergedDefaults = { ...defaults, ...customDefaults };
  return (userConfig: Partial<Config> = {}): Config => {
    const config = { ...mergedDefaults, ...userConfig };
    if (config.timeout <= 0) {
      config.timeout = mergedDefaults.timeout;
    }
    if (config.retries < 0) {
      config.retries = mergedDefaults.retries;
    }
    return config;
  };
}