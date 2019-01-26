import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import * as http from 'http'
import * as util from 'util'
import { logger } from '../../config/logger'
import settings from '../../config/settings'
import getUserFromAuthHeader from '../middleware/getUserFromAuthHeader'
import { resolvers, typeDefs } from './schema'

export async function StartGraphQL(app: Application) {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: settings.env === 'development' ? true : false,
    subscriptions: {
      onConnect: (connectionParams, websocket) => {
        logger.info('Connected to subscription websocket.')
      },
      onDisconnect: () => {
        logger.info('Disconnected from subscription websocket.')
      },
    },
    context: async ({ req, connection }) => {
      // https://www.apollographql.com/docs/apollo-server/features/subscriptions.html#Context-with-Subscriptions
      if (connection) {
        return connection.context
      }

      // add currently auth'd user to context
      let user = req.headers.authorization || ''
      user = await getUserFromAuthHeader(user)
      logger.debug(`ApolloServer context.user - ${util.inspect(user, {showHidden: false, depth: null})}`)

      return {
        user,
      }
    },
  })

  server.applyMiddleware({ app })

  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(settings.port, () => {
    logger.info(`Server ready at http://127.0.0.1:${settings.port}${server.graphqlPath} 🚀`)
    logger.info(`Subscriptions ready at ws://127.0.0.1:${settings.port}${server.subscriptionsPath} 🚀`)
  })
}
