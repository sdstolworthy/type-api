import * as Sentry from '@sentry/node'
import * as Transport from 'winston-transport'
import settings from '../settings'
import { logger } from './index'

export class SentryTransport extends Transport {
  constructor(opts) {
    super(opts)
    Sentry.init({
      dsn: settings.sentry.dsn,
      environment: settings.env,
      attachStacktrace: true,
    })
  }

  public log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    if (info.level === 'warn' || info.level === 'error') {
      Sentry.captureException(info)
    } else {
      Sentry.captureMessage(info.message)
    }

    // avoid an infinite loop
    if (info.level !== 'silly') {
      logger.silly('Logged to Sentry')
    }

    callback()
  }
}
