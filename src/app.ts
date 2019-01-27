import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cors from 'cors'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as passport from 'passport'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import authRouter from './api/auth'
import { StartGraphQL } from './api/data'
import { HttpError } from './config/errorHandler'
import sendHttpError from './config/errorHandler/sendHttpError'
import { logger, stream } from './config/logger'
import { TypeORMLogger } from './config/logger/typeorm'
import settings from './config/settings'

export interface IEnv {
  PORT: number | string
}

export async function run({
  PORT = settings.port,
}: IEnv) {
  if (typeof PORT === 'string') {
    PORT = parseInt(PORT, 10)
  }

  // silly log the settings for a sanity check
  logger.silly('settings:')
  logger.silly(settings)

  // database
  let connectionOptions = await getConnectionOptions()
  connectionOptions = {
    ...connectionOptions,
    logging: 'all',
    logger: new TypeORMLogger(),
  }
  const connection: Connection = await createConnection(connectionOptions)

  const app = express()

  app.set('env', settings.env)
  app.set('port', settings.port)

  logger.silly(`app env: ${app.get('env')}`)
  logger.silly(`app port: ${app.get('port')}`)

  // middleware
  app.use(helmet())
  app.use(cors({
    // TODO: is this implementation is subpar and too restrictive?
    origin: (origin, cb) => {
      logger.silly(`Origin: ${origin}`)
      if (settings.allowedHosts.indexOf(origin) !== -1 || !origin) {
        cb(null, true)
      } else {
        cb(new HttpError(
          401,
          'Not allowed by CORS',
          settings.env === 'development' ? 'Check your env.ALLOWED_HOSTS' : '',
        ))
      }
    },
  }))
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
  StartGraphQL(app)

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
}
