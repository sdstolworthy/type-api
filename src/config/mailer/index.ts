import * as nodemailer from 'nodemailer'
import { logger } from '../logger'
import settings from '../settings'

const transporterConfig = {
  pool: false,
  host: settings.mailHost,
  port: settings.mailPort,
  secure: settings.mailSecure,
  auth: {
    user: settings.mailUser,
    pass: settings.mailPass,
  },
  debug: true,
}

const transporter = nodemailer.createTransport(transporterConfig)

const sendMail = (
  {to, from = settings.mailFrom, subject, text}: {to: string, from?: string, subject: string, text: string},
  done?: CallableFunction,
) => {
  logger.silly('Email config:')
  logger.silly(transporterConfig)

  const data = {
    to,
    from,
    subject,
    text,
  }

  logger.silly('Email details:')
  logger.silly(data)

  logger.debug('Sending an email')
  transporter.sendMail(data, (err, info, response) => {
    if (err) {
      logger.error(err)
      return done(err, false)
    }

    logger.debug('Sent an email')
    logger.debug(info)

    return done(null, response)
  })
}

export default sendMail
