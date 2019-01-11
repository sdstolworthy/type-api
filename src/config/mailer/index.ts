import * as mailgun from 'mailgun-js'

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@example.com'

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
})

/**
 * Sends an email.
 * @function
 * @param {object} data - data about the email being sent
 * @param {string} data.to - the email address of the recipient
 * @param {string} data.[from] - the email address of the sender; defaults to process.env.FROM_EMAIL
 * @param {string} data.subject - the subject of the email
 * @param {string} data.text - the body of the email
 * @param {CallableFunction} done - callback
 */
const send = (
  {to, from = FROM_EMAIL, subject, text}: {to: string, from?: string, subject: string, text: string},
  done: CallableFunction,
) => {
  const data = {
    to,
    from,
    subject,
    text,
  }

  mg.messages().send(data, (err: any, body: any) => {
    if (err) {
      return done(err)
    }
    return done(body)
  })
}

export default send
