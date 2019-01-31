import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as passport from 'passport'
import authRouter from './api/auth'
import { HttpError } from './config/errorHandler'
import sendHttpError from './config/errorHandler/sendHttpError'
import { logger, stream } from './config/logger'
import settings from './config/settings'

let PORT = settings.port
if (typeof PORT === 'string') {
  PORT = parseInt(PORT, 10)
}

// silly log the settings for a sanity check
logger.silly('settings:')
logger.silly(settings)

const app = express()

app.set('env', settings.env)
app.set('port', settings.port)

logger.silly(`app env: ${app.get('env')}`)
logger.silly(`app port: ${app.get('port')}`)

// middleware
app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use(morgan('tiny', { stream }))

// initialize custom errors
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  /**
   * Using an array that stores errors until we are ready to access them again
   * ensures that we can capture all errors along the path to sending the errors
   * back to the user.
   */
  res.locals.errors = []
  next()
})

// routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
  })
})

app.use('/auth', authRouter)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // only run this if errors not handled by someone else
  let error = err
  if (!res.locals.errors.length) {
    error = {
      name: err.name || 'Error',
      msg: err.mgs || err.message || 'Unhandled error',
    }
    logger.debug(error)
    res.locals.errors.push(error)
  }
  next(error)
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.locals.errors.length > 0) {
    // at least one error exists; send the errors
    return res.status(400)
    .json({ errors: res.locals.errors })
  }
  next(err)
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // An error occurred but wasn't handled.
  const error = settings.env === 'development' ? err : 'Internal Server Error'
  logger.error(error)

  res.status(500)
  .json({ error })
})

export default app
