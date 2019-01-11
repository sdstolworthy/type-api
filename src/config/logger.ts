import * as path from 'path'
import * as winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'warn',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`),
      ),
    }),
    new winston.transports.File({
      level: process.env.LOG_LEVEL || 'error',
      filename: 'app.log',
    }),
  ],
})

// capture streamed info
class Stream {
  write(text: string) {
    logger.info(text)
  }
}
export const stream = new Stream()
