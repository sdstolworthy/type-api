import {
  Connection,
  ConnectionOptions,
  createConnection,
} from 'typeorm'
import { logger } from './logger'
import { TypeORMLogger } from './logger/typeorm'
import settings from './settings'

/**
 * @export
 * @class Database
 */
export default class Database {
  private connection: Connection

  /**
   * @public
   * @memberof Database
   */
  public async init(callback?: () => void) {
    if (!settings.dbUrl) {
      logger.warn('No DATABASE_URL environment variable is set.')
    }

    logger.silly(`Opening connection to database using the "${settings.env}" environment`)

    const connectionOptions: ConnectionOptions = {
      type: 'postgres',
      url: settings.env === 'test' && settings.dbTestUrl
        ? settings.dbUrl
        : settings.dbTestUrl,

      // only drop schema in test environment; this keeps tests separate
      dropSchema: settings.env === 'test' ? true : false,

      synchronize: false,
      migrationsRun: true,
      entityPrefix: settings.dbTablePrefix,
      entities: [__dirname + '/../**/*.entity'],
      migrations: [__dirname + '/../api/migrations/**'],
      subscribers: [__dirname + '/../api/subscribers/**'],

      logging: 'all',
      logger: new TypeORMLogger(),
    }
    logger.silly('Database connection options:')
    logger.silly(connectionOptions)
    this.connection = await createConnection(connectionOptions)

    if (typeof callback === 'function') {
      callback()
    }
  }

  public async close(callback?: () => void) {
    await this.connection.close()

    if (typeof callback === 'function') {
      callback()
    }
  }
}
