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
   */
  dbPostgresUrl: process.env.POSTGRES_URL,
  dbPostgresTestUrl: process.env.POSTGRES_TEST_URL,
  dbTablePrefix: 'app_', // this does nothing; see /ormconfig.js

  /**
   * Mailgun
   *
   * This API uses Mailgun as its mail transport. These MUST BE SET in the environment
   * variables in order for the auth to work.
   */
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  fromEmail: process.env.FROM_EMAIL || 'noreply@example.com',

  /**
   * Test settings
   */
  testTypeormConnectionOptions: {
    type: 'postgres',
    url: this.dbPostgresTestUrl,
    entities: [
      'src/**/*.entity.ts',
    ],
    logging: false,
    dropSchema: true, // isolate each test case
    synchronize: true,
  },
}
