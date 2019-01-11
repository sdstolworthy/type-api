import { Application } from 'express'
import { bootstrap } from 'vesper'
import { logger } from '../../config/logger'

export async function StartGraphQL(app: Application) {
  const port = (parseInt(process.env.PORT, 10) + 1) || 3001 // avoid port collision with express app

  bootstrap({
      port,
      expressApp: app,
      cors: true,
      controllers: [__dirname + '/**/*.controller.ts'],
      resolvers: [__dirname + '/**/*.resolver.ts'],
      schemas: [__dirname + '/**/*.gql'],
  }).then((vesper) => {
      logger.info('GraphQL ready. 🚀')
  }).catch((error) => {
      logger.error(error.stack ? error.stack : error)
  })
}
