import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const transport = new (transports.DailyRotateFile)({
    filename: 'application-%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
        format.timestamp(),
        format.json()
    )
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.simple()
    ),
    transports: [
        transport,
        new transports.Console()
    ],
});

export default logger;