import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import * as util from 'util'
import { logger } from '../../config/logger'
import settings from '../../config/settings'
import getUserFromAuthHeader from '../middleware/getUserFromAuthHeader'
import { resolvers, typeDefs } from './schema'

export async function StartGraphQL(app: Application) {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      // add currently auth'd user to context
      let user = req.headers.authorization || ''
      user = await getUserFromAuthHeader(user)
      logger.debug(`ApolloServer context.user - ${util.inspect(user, {showHidden: false, depth: null})}`)

      return {
        user,
      }
    },
  })

  server.applyMiddleware({ app }) // app is from an existing express app

  app.listen({ port: settings.port }, () => {
    logger.info(`Server ready at http://127.0.0.1:${settings.port}${server.graphqlPath} 🚀`)
  })
}
