import * as http from 'http'
import graphql from './api/data'
import app from './app'
import Cron from './config/cron'
import Database from './config/db'
import { logger } from './config/logger'
import settings from './config/settings'

/**
 * @export
 * @class Server
 */
export default class Server {
  /**
   * Initialize the server. This can be called from anywhere, including tests,
   * to scaffold out the full server. callback() is an optional parameter mostly
   * used to pass done() in testing.
   * @static
   * @memberof Server
   */
  public static async init(callback?: () => void) {
    await Database.init() // must be called first
    await Cron.init()

    await graphql.applyMiddleware({ app })
    const httpServer = await http.createServer(app)
    await graphql.installSubscriptionHandlers(httpServer)

    httpServer.listen(settings.port, () => {
      logger.info(`Server ready at http://127.0.0.1:${settings.port}${graphql.graphqlPath} 🚀`)
      logger.info(`Subscriptions ready at ws://127.0.0.1:${settings.port}${graphql.subscriptionsPath} 🚀`)

      if (callback) {
        callback()
      }
    })
  }
}
