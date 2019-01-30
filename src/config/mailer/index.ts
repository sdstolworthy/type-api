import * as nodemailer from 'nodemailer'
import { logger } from '../logger'
import settings from '../settings'
import parse from './templateParser'

/**
 * You can either pass in a `text` parameter or you can pass in a `template` and
 * `link`, but you cannot pass in both.
 * https://stackoverflow.com/a/37688375/5623385
 */
interface IMailer {
  to: string,
  from?: string,
  subject: string,

}
interface IMailerText extends IMailer {
  text: string,
}
interface IMailerHTML extends IMailer {
  template: string,
  link: string,
}
type MailerArgs = IMailerText | IMailerHTML

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

/**
 *
 */
const sendMail = (
  opts: MailerArgs,
  done?: CallableFunction,
) => {
  const data: any = opts
  logger.silly('Email config:')
  logger.silly(transporterConfig)
  logger.silly('Email details:')
  logger.silly(data)

  data.from = data.from || settings.mailFrom

  if (data.template) {
    // this email is an html email
    logger.debug('Sending an HTML email')
    const html = parse(data.template, data.link)
    transporter.sendMail({
      to: data.to,
      from: data.from,
      subject: data.subject,
      html,
    })

  } else {
    // this email is a plain text email
    logger.debug('Sending a plain text email')
    transporter.sendMail({
      to: data.to,
      from: data.from,
      subject: data.subject,
      text: data.text,
    })
  }
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
