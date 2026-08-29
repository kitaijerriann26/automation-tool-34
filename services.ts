interface InputData {
  id: string;
  amount: number;
  description: string;
}

class ProcessingService {
  private validateInput(input: InputData): boolean {
    if (!input || typeof input !== 'object') {
      console.warn('Validation failed: Input must be an object');
      return false;
    }
    if (!input.id || typeof input.id !== 'string' || input.id.length < 5) {
      console.warn('Validation failed: ID must be string with at least 5 characters');
      return false;
    }
    if (typeof input.amount !== 'number' || input.amount <= 0 || isNaN(input.amount)) {
      console.warn('Validation failed: Amount must be positive number');
      return false;
    }
    if (!input.description || typeof input.description !== 'string' || input.description.trim().length === 0) {
      console.warn('Validation failed: Description must be non-empty string');
      return false;
    }
    return true;
  }
  private processValidInput(input: InputData): void {
    const processedValue = input.amount * 1.05;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Processed ${input.id}: ${input.description} (amount: ${input.amount}) -> ${processedValue}`);
  }
  public mainProcessingLoop(inputs: InputData[]): void {
    console.log('Starting main processing loop');
    let processedCount = 0;
    let invalidCount = 0;
    for (const input of inputs) {
      if (this.validateInput(input)) {
        this.processValidInput(input);
        processedCount++;
      } else {
        invalidCount++;
      }
    }
    console.log(`Main loop finished. Total processed: ${processedCount}, invalid skipped: ${invalidCount}`);
  }
}


export { ProcessingService, InputData };