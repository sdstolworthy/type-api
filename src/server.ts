import * as http from 'http'
import graphql from './api/data'
import app from './app'
import Cron from './config/cron'
import { logger } from './config/logger'
import settings from './config/settings'

Cron.init()

graphql.applyMiddleware({ app })

const httpServer = http.createServer(app)
graphql.installSubscriptionHandlers(httpServer)

httpServer.listen(settings.port, () => {
  logger.info(`Server ready at http://127.0.0.1:${settings.port}${graphql.graphqlPath} 🚀`)
  logger.info(`Subscriptions ready at ws://127.0.0.1:${settings.port}${graphql.subscriptionsPath} 🚀`)
  app.emit('serverStarted')
})
