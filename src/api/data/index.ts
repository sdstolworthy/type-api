import { Application } from 'express'
import { bootstrap } from 'vesper'
import { port } from '../../app'
import { logger } from '../../config/logger'

export async function StartGraphQL(app: Application) {
  bootstrap({
      port,
      expressApp: app,
      cors: true,
      controllers: [__dirname + '/**/*.controller.ts'],
      resolvers: [__dirname + '/**/*.resolver.ts'],
      schemas: [__dirname + '/**/*.gql'],
  }).then((vesper) => {
      logger.info(`API listening on port ${port} 🚀`)
  }).catch((error) => {
      logger.error(error.stack ? error.stack : error)
  })
}
