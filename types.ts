export interface ErrorDetails {
  timestamp: Date;
  context: string;
  input?: any;
}

export class AutomationError extends Error {
  public readonly code: string;
  public readonly details: ErrorDetails;
  constructor(message: string, code: string, context: string, input?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = {
      timestamp: new Date(),
      context,
      input,
    };
  }
}

export class EdgeCaseError extends AutomationError {
  constructor(message: string, context: string, input?: any) {
    super(message, 'EDGE_CASE', context, input);
  }
}

export class InvalidInputError extends AutomationError {
  constructor(message: string, context: string, input?: any) {
    super(message, 'INVALID_INPUT', context, input);
  }
}

export function safeExecute<T>(
  fn: () => T,
  context: string,
  defaultValue: T
): T {
  try {
    return fn();
  } catch (error: unknown) {
    if (error instanceof AutomationError) {
      console.error(`Automation error in ${context}: ${error.message}`, error.details);
    } else if (error instanceof Error) {
      console.error(`Unexpected error in ${context}: ${error.message}`);
    } else {
      console.error(`Unknown error in ${context}`);
    }
    return defaultValue;
  }
}

export function isAutomationError(error: unknown): error is AutomationError {
  return error instanceof AutomationError;
}

export function handleDivisionEdgeCase(a: number, b: number): number {
  if (b === 0) {
    throw new EdgeCaseError('Division by zero encountered', 'division operation', { a, b });
  }
  if (isNaN(a) || isNaN(b)) {
    throw new InvalidInputError('Invalid numeric input', 'division operation', { a, b });
  }
  return a / b;
}