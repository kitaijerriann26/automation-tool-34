import * as fs from 'fs';
import * as path from 'path';

export interface LoggerConfig {
  logDir: string;
  maxFileSize: number; // in bytes
  maxFiles: number;
}

export class RotatingLogger {
  private logDir: string;
  private logFilePath: string;
  private maxFileSize: number;
  private maxFiles: number;

  constructor(config: LoggerConfig) {
    this.logDir = config.logDir;
    this.logFilePath = path.join(this.logDir, 'app.log');
    this.maxFileSize = config.maxFileSize;
    this.maxFiles = config.maxFiles;

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;
  }

  private rotate(): void {
    for (let i = this.maxFiles - 1; i >= 1; i--) {
      const oldPath = path.join(this.logDir, `app.${i}.log`);
      const newPath = path.join(this.logDir, `app.${i + 1}.log`);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }
    if (fs.existsSync(this.logFilePath)) {
      fs.renameSync(this.logFilePath, path.join(this.logDir, 'app.1.log'));
    }
  }

  private write(level: string, message: string): void {
    const formatted = this.formatMessage(level, message);

    if (fs.existsSync(this.logFilePath)) {
      const stats = fs.statSync(this.logFilePath);
      if (stats.size + Buffer.byteLength(formatted) > this.maxFileSize) {
        this.rotate();
      }
    }

    fs.appendFileSync(this.logFilePath, formatted, 'utf8');
    console.log(formatted.trim());
  }

  public info(message: string): void {
    this.write('INFO', message);
  }

  public warn(message: string): void {
    this.write('WARN', message);
  }

  public error(message: string): void {
    this.write('ERROR', message);
  }
}