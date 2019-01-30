/**
 * settings.ts
 * This should be the ONLY file that accesses process.env.
 */
import * as dotenv from 'dotenv'
dotenv.config()

export default {
  port: parseInt(process.env.PORT, 10) || 3100,
  env: process.env.NODE_ENV || 'development',
  secretKey: process.env.SECRET_KEY || 'replace_this_key_474@itys*-gng^0phyeohag)qxa9$3v64+h^ze#',
  logLevel: process.env.LOG_LEVEL || 'warn',

  /**
   * Database
   *
   * These settings alter the structure and/or naming conventions of the database.
   * These should not be changed in production.
   *
   * More database settings are in /ormconfig.js
   */
  dbPostgresUrl: process.env.POSTGRES_URL,
  dbPostgresTestUrl: process.env.POSTGRES_TEST_URL,

  /**
   * Mailer
   *
   * This API uses nodemailer to run transports. Any SMTP transport will do.
   */
  mailHost: process.env.MAIL_HOST,
  mailPort: parseInt(process.env.MAIL_PORT, 10) || 587,
  mailSecure: (process.env.MAIL_SECURE === 'true') || false,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  mailFrom: process.env.MAIL_FROM || 'noreply@example.com',
}
