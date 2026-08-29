export interface ToolConfig {
  /**
   * Unique identifier for this automation instance
   */
  id: string;

  /**
   * Human readable name for the tool
   */
  name: string;

  /**
   * Current version of the automation tool
   */
  version: string;

  /**
   * Maximum number of tasks that can run at the same time
   */
  maxConcurrentTasks: number;

  /**
   * Timeout duration in milliseconds for operations
   */
  operationTimeout: number;

  /**
   * List of enabled feature names
   */
  features: string[];

  /**
   * Additional custom parameters as key value pairs
   */
  customParams: Record<string, string | number | boolean>;
}

/**
 * Default configuration values used when no overrides are provided
 */
export const DEFAULT_CONFIG: ToolConfig = {
  id: 'automation-tool-34',
  name: 'General Automation Tool',
  version: '1.0.0',
  maxConcurrentTasks: 10,
  operationTimeout: 60000,
  features: ['logging', 'error-handling', 'retry-mechanism'],
  customParams: {
    logLevel: 'info',
    retryCount: 3,
  },
};

/**
 * Checks if a given configuration object meets all requirements
 * @param config Partial or full config to check
 * @returns Whether the config is valid
 */
export function isValidConfig(config: Partial<ToolConfig>): boolean {
  if (typeof config.name !== 'string' || config.name.length === 0) {
    return false;
  }
  if (typeof config.maxConcurrentTasks !== 'number' || config.maxConcurrentTasks <= 0) {
    return false;
  }
  if (typeof config.operationTimeout !== 'number' || config.operationTimeout < 100) {
    return false;
  }
  if (!Array.isArray(config.features)) {
    return false;
  }
  if (config.customParams && typeof config.customParams !== 'object') {
    return false;
  }
  return true;
}

/**
 * Builds a complete configuration object from defaults and overrides
 * @param overrides Optional partial config to merge in
 * @returns A fully typed and valid ToolConfig instance
 */
export function createConfig(overrides: Partial<ToolConfig> = {}): ToolConfig {
  const merged: ToolConfig = {
    ...DEFAULT_CONFIG,
    ...overrides,
    customParams: {
      ...DEFAULT_CONFIG.customParams,
      ...overrides.customParams,
    },
  };

  if (!isValidConfig(merged)) {
    throw new Error('The provided configuration is invalid');
  }

  return merged;
}

/**
 * Enables or disables a specific feature in the config
 * @param config The base configuration to modify
 * @param featureName Name of the feature to change
 * @param enable Set to true to enable, false to disable
 * @returns New config object with updated features
 */
export function updateFeature(config: ToolConfig, featureName: string, enable: boolean): ToolConfig {
  const updatedFeatures = [...config.features];
  const hasFeature = updatedFeatures.includes(featureName);

  if (enable && !hasFeature) {
    updatedFeatures.push(featureName);
  } else if (!enable && hasFeature) {
    const index = updatedFeatures.indexOf(featureName);
    updatedFeatures.splice(index, 1);
  }

  return {
    ...config,
    features: updatedFeatures,
  };
}