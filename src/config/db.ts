import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { TypeORMLogger } from './logger/typeorm'

const connectDb = async () => {
  let connectionOptions = await getConnectionOptions()
  connectionOptions = {
    ...connectionOptions,
    logging: 'all',
    logger: new TypeORMLogger(),
  }
  const connection: Connection = await createConnection(connectionOptions)
  return connection
}

export default connectDb
