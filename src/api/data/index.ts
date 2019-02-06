import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import { logger } from '../../config/logger'
import settings from '../../config/settings'
import getUserFromAuthHeader from '../middleware/getUserFromAuthHeader'
import getUserPermissions from './_helpers/getUserPermissions'
import { resolvers, typeDefs } from './schema'

export default new ApolloServer({
  typeDefs,
  resolvers,
  tracing: settings.env === 'development' ? true : false,
  playground: settings.env === 'development' ? true : settings.apolloForcePlayground,
  introspection: settings.env === 'development' ? true : settings.apolloForcePlayground,
  engine: {
    // https://www.apollographql.com/docs/apollo-server/features/metrics.html#Apollo-Engine
    apiKey: settings.apolloEngineApiKey,
  },
  subscriptions: {
    onConnect: async (connectionParams: any, websocket: any) => {
      logger.debug('Connected to subscription websocket.')

      // add currently auth'd user to context
      let user = connectionParams.Authorization || ''
      user = await getUserFromAuthHeader(user)
      logger.debug('ApolloServer websocket context.user:')
      logger.debug(user)

      const permissions: any[] = await getUserPermissions(user)
      logger.debug(permissions)

      return {
        user,
      }
    },
    onDisconnect: () => {
      logger.debug('Disconnected from subscription websocket.')
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
    logger.debug('ApolloServer context.user:')
    logger.debug(user)

    const permissions: string[] = await getUserPermissions(user)
    logger.debug('ApolloServer context.permissions:')
    logger.debug(permissions)

    return {
      user,
      permissions,
    }
  },
})
