import * as util from 'util'
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
        winston.format.printf((data) => {
          if (typeof data.message === 'object') {
            return `${data.timestamp} ${data.level}: ${util.inspect(data.message, false, null, true)}`
          }
          return `${data.timestamp} ${data.level}: ${data.message}`
        }),
      ),
    }),
    new winston.transports.File({
      level: 'warn',
      filename: 'app.log',
    }),
  ],
})

// capture streamed info
class Stream {
  public write(text: string) {
    /**
     * Frequently, Morgan (and other loggers) will include linebreaks in their
     * text (as all loggers should). When wrapping with this logger, we want to
     * remove those linebreaks since we are already including our own.
     * https://stackoverflow.com/a/10805198/5623385
     */
    logger.info(text.replace(/(\r\n|\n|\r)/gm, ''))
  }
}
export const stream = new Stream()
