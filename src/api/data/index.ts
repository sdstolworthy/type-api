import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import * as util from 'util'
import { port } from '../../app'
import { logger } from '../../config/logger'
import getDecodedJwt from '../middleware/getDecodedJwt'
import { resolvers, typeDefs } from './schema'

export async function StartGraphQL(app: Application) {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // logger.debug('auth:')
      // logger.debug(util.inspect(req.headers.authorization, {showHidden: false, depth: null}))
    },
  })

  server.applyMiddleware({ app }) // app is from an existing express app

  app.listen({ port }, () => {
    logger.info(`Server ready at http://127.0.0.1:${port}${server.graphqlPath} 🚀`)
  })
}
