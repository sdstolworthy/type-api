import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { TypeORMLogger } from './logger/typeorm'

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
    let connectionOptions = await getConnectionOptions()
    connectionOptions = {
      ...connectionOptions,
      logging: 'all',
      logger: new TypeORMLogger(),
    }
    this.connection = await createConnection(connectionOptions)
  }

  public async close() {
    this.connection.close()
  }
}
