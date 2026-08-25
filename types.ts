export type ErrorCode =
  | 'INVALID_INPUT'
  | 'TIMEOUT'
  | 'NETWORK_FAILURE'
  | 'RESOURCE_LIMIT'
  | 'UNEXPECTED_STATE';
export interface ErrorDetails {
  timestamp: Date;
  context: string;
  data?: Record<string, unknown>;
}
export interface AutomationError extends Error {
  code: ErrorCode;
  details: ErrorDetails;
}
export class CustomError extends Error implements AutomationError {
  code: ErrorCode;
  details: ErrorDetails;
  constructor(
    code: ErrorCode,
    message: string,
    context: string,
    data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = {
      timestamp: new Date(),
      context,
      data,
    };
  }
}
export function handleAutomationError(error: unknown, context: string = 'general'): string {
  if (error instanceof CustomError) {
    // Log the error with code and details
    console.error(
      `[${error.code}] ${error.message} - Context: ${error.details.context}`
    );
    // Handle specific edge cases
    switch (error.code) {
      case 'TIMEOUT':
        return 'retry_with_backoff';
      case 'NETWORK_FAILURE':
        return 'retry';
      case 'INVALID_INPUT':
        return 'abort';
      default:
        return 'fail';
    }
  } else if (error instanceof Error) {
    console.error(`Unexpected error in ${context}: ${error.message}`);
    return 'fail';
  } else if (typeof error === 'string') {
    console.error(`String error in ${context}: ${error}`);
    return 'fail';
  } else {
    // Edge case for non-standard error types
    console.error(`Unknown error in ${context}: ${JSON.stringify(error)}`);
    return 'fail';
  }
}
export function safeProcess(input: unknown): { success: boolean; result?: string; error?: string } {
  try {
    if (input == null) {
      throw new CustomError('INVALID_INPUT', 'Input cannot be null or undefined', 'safeProcess');
    }
    if (typeof input === 'object' && input !== null && 'id' in input && typeof (input as any).id !== 'string') {
      throw new CustomError('INVALID_INPUT', 'Task ID must be string', 'safeProcess', { input });
    }
    // Simulate processing
    const result = `Processed: ${JSON.stringify(input)}`;
    return { success: true, result };
  } catch (err) {
    const action = handleAutomationError(err, 'safeProcess');
    return { success: false, error: action };
  }
}