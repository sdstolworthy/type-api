import * as winston from 'winston'
import settings from '../settings'

export const logger = winston.createLogger({
  level: settings.logLevel || 'warn',
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
      level: settings.logLevel || 'error',
      filename: 'app.log',
    }),
  ],
})

// capture streamed info
class Stream {
  public write(text: string) {
    logger.info(text)
  }
}
export const stream = new Stream()
