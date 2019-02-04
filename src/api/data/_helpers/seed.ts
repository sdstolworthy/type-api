import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { logger } from '../../../config/logger'

/**
 * This class runs seeds for the database.
 * @class
 */
export class Seed {
  public connection: Connection
  public entity: any
  public seeds: any[]

  constructor(entity: any, seeds: any[]) {
    this.entity = entity
    this.seeds = seeds
  }

  public async seed() {
    let connectionOptions = await getConnectionOptions()
    connectionOptions = {
      ...connectionOptions,
      name: 'seedConnection',
    }

    this.connection = await createConnection(connectionOptions)

    logger.info('Seeding started.')

    await this.connection.createQueryBuilder()
    .insert()
    .into(this.entity)
    .values(this.seeds)
    .execute()

    logger.info('Seeding complete.')

    await this.connection.close()
  }
}
