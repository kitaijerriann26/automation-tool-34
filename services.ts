import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

/**
 * Logger setup for automation-tool-34 with daily rotation.
 * Keeps logs for 14 days and handles file size limits.
 */
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new winston.transports.DailyRotateFile({
      dirname: path.join(__dirname, '../logs'),
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Error boundary for unhandled exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});