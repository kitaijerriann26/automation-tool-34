import * as fs from 'fs';
import * as path from 'path';

interface LogOptions {
  logDir?: string;
  maxSizeMB?: number;
  logLevel?: string;
}

export class LoggerService {
  private readonly logFilePath: string;
  private readonly maxSize: number;
  private currentLevel: string;

  constructor(options: LogOptions = {}) {
    const logDir = options.logDir || './logs';
    this.maxSize = (options.maxSizeMB || 5) * 1024 * 1024;
    this.currentLevel = options.logLevel || 'info';

    // Create logs directory if it does not exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logFilePath = path.join(logDir, 'automation.log');
  }

  private shouldRotate(): boolean {
    if (!fs.existsSync(this.logFilePath)) {
      return false;
    }
    const stats = fs.statSync(this.logFilePath);
    return stats.size > this.maxSize;
  }

  private rotateLog(): void {
    if (!fs.existsSync(this.logFilePath)) {
      return;
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const dir = path.dirname(this.logFilePath);
    const ext = path.extname(this.logFilePath);
    const base = path.basename(this.logFilePath, ext);
    const rotatedPath = path.join(dir, `${base}-${timestamp}${ext}`);

    // Perform log rotation by renaming current file with timestamp
    fs.renameSync(this.logFilePath, rotatedPath);
  }

  private writeLog(level: string, message: string): void {
    if (this.shouldRotate()) {
      this.rotateLog();
    }
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logLine, 'utf8');
  }

  info(message: string): void {
    if (this.currentLevel === 'info' || this.currentLevel === 'debug') {
      this.writeLog('info', message);
    }
  }

  warn(message: string): void {
    if (['info', 'warn', 'debug'].includes(this.currentLevel)) {
      this.writeLog('warn', message);
    }
  }

  error(message: string): void {
    this.writeLog('error', message);
  }

  debug(message: string): void {
    if (this.currentLevel === 'debug') {
      this.writeLog('debug', message);
    }
  }
}