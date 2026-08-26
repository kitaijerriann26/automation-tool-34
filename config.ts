import * as fs from 'fs';
import * as path from 'path';

export interface AppConfig {
  readonly maxRetries: number;
  readonly timeoutMs: number;
  readonly workingDirectory: string;
}

const DEFAULT_CONFIG: AppConfig = {
  maxRetries: 3,
  timeoutMs: 5000,
  workingDirectory: './data',
};

/**
 * Safely loads and validates configuration from a JSON file.
 * Handles edge cases like missing files, permission errors, and invalid JSON.
 */
export function loadConfig(filePath?: string): AppConfig {
  if (!filePath) {
    return DEFAULT_CONFIG;
  }

  const resolvedPath = path.resolve(filePath);

  try {
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Configuration file not found at: ${resolvedPath}`);
    }

    const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
    const parsed = JSON.parse(fileContent);

    return {
      maxRetries: typeof parsed.maxRetries === 'number' ? parsed.maxRetries : DEFAULT_CONFIG.maxRetries,
      timeoutMs: typeof parsed.timeoutMs === 'number' ? parsed.timeoutMs : DEFAULT_CONFIG.timeoutMs,
      workingDirectory: typeof parsed.workingDirectory === 'string' ? parsed.workingDirectory : DEFAULT_CONFIG.workingDirectory,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[Config] Failed to load from ${resolvedPath}. Falling back to defaults. Reason: ${errorMessage}`);
    return DEFAULT_CONFIG;
  }
}