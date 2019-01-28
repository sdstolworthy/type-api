import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { TypeORMLogger } from './logger/typeorm'

/**
 * @export
 * @class Database
 */
export default class Database {
  /**
   * @static
   * @memberof Database
   */
  public static async init() {
    let connectionOptions = await getConnectionOptions()
    connectionOptions = {
      ...connectionOptions,
      logging: 'all',
      logger: new TypeORMLogger(),
    }
    const connection: Connection = await createConnection(connectionOptions)
    return connection
  }
}
