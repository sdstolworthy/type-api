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
  public async init() {
    const connectionOptions: ConnectionOptions = {
      type: 'postgres',
      url: settings.env === 'test' ? settings.dbUrl : settings.dbTestUrl,

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
  }

  public async close() {
    this.connection.close()
  }
}
