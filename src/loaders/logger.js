const winston = require('winston')
const { combine, timestamp, printf, colorize } = winston.format

const myFormat = printf(({ level, message, timestamp }) => {
    // Customize the log format here
    return `${timestamp} ${level}: ${message}`
})

const transports = []

const consoleFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat,
)

transports.push(new winston.transports.Console({ format: consoleFormat }))

const LoggerInstance = winston.createLogger({
    level: 'info',
    levels: winston.config.npm.levels,
    format: combine(
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat,
    ),
    transports,
})

module.exports = { Logger: LoggerInstance }
