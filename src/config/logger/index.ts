/* tslint:disable no-var-requires */
import * as util from 'util'
import * as winston from 'winston'
import { Loggly } from 'winston-loggly-bulk'
import settings from '../settings'
import { SentryTransport } from './sentry'

export const logger = winston.createLogger({
  level: settings.logLevel || 'warn',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
  exitOnError: false,
})

logger.add(new winston.transports.Console({
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf((data) => {
      if (typeof data.message === 'object') {
        return `${data.level}: \n${util.inspect(data.message, false, null, true)}`
      }
      return `${data.level}: ${data.message}`
    }),
  ),
}))

if (settings.sentry.dsn) {
  logger.info('Adding Sentry logger')
  logger.add(new SentryTransport({
    level: settings.sentry.logLevel || 'warn',
  }))
}

if (settings.loggly.token && settings.loggly.subdomain) {
  logger.info('Adding Loggly logger')
  logger.add(new Loggly({
    level: settings.loggly.logLevel || 'warn',
    token: settings.loggly.token,
    subdomain: settings.loggly.subdomain,
    tags: ['Winston-NodeJS'],
    json: true,
  }))
}

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
