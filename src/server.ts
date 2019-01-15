/* tslint:disable no-console */
import 'reflect-metadata'

import app from './app'
import * as serverHandlers from './config/serverHandlers'

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'))

// server handlers
server.on('error', (error: Error) => serverHandlers.onError(error, app.get('port')))
server.on('listening', serverHandlers.onListening.bind(server))

export default server
