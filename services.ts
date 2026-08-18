import { createLogger, transports, format } from 'winston';
import { loggingRotate } from 'winston-daily-rotate-file';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new loggingRotate({
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        })
    ]
});

export default logger;

// Example usage:
logger.info('Logger initialized with rotation');
logger.error('This is an error message');
