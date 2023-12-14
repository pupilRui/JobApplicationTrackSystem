// logger.js
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info', // Set the level of logs you want to see
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;
