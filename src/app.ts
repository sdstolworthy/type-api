import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as passport from 'passport'
import authRouter from './api/auth'
import connectDb from './config/db'
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

// connect to the database
connectDb()

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

// routes
app.get('/', (req, res) => {
  res.send('Up and running.')
})

app.use('/auth', authRouter)

app.use((error: any, req: express.Request, res: any, next: express.NextFunction) => {
  logger.error(error)

  if (typeof error === 'number') {
    error = new HttpError(error) // next(404)
  }

  sendHttpError(error, req, res, next)
})
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500)
  .json({ error })
})

export default app
