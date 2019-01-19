import 'reflect-metadata'

import * as dotenv from 'dotenv'
dotenv.config()

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as errorHandler from 'errorhandler'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as passport from 'passport'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import authRouter from './api/auth'
import { StartGraphQL } from './api/data'
import getDecodedJwt from './api/middleware/getDecodedJwt'
import { HttpError } from './config/errorHandler'
import httpErrorModule from './config/errorHandler/sendHttpError'
import { stream } from './config/logger'
import { TypeORMLogger } from './config/logger/typeorm'

export const port = parseInt(process.env.PORT, 10) || 3100

export interface IEnv {
  PORT: number | string
}

export async function run({
  PORT = port,
}: IEnv) {
  if (typeof PORT === 'string') {
    PORT = parseInt(PORT, 10)
  }

  // database
  let connectionOptions = await getConnectionOptions()
  connectionOptions = {...connectionOptions, logger: new TypeORMLogger()}
  const connection: Connection = await createConnection(connectionOptions)

  const app = express()

  app.set('env', process.env.NODE_ENV || 'development')
  app.set('port', port)

  // middleware
  app.use(helmet())
  app.use(compression())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(passport.initialize())

  // error handler
  // don't use in production
  if (app.get('env') === 'development') {
    app.use(errorHandler())
  }

  app.use(httpErrorModule)
  app.use((error: Error, req: express.Request, res: any, next: express.NextFunction) => {
    if (typeof error === 'number') {
      error = new HttpError(error) // next(404)
    }

    if (error instanceof HttpError) {
      res.sendHttpError(error)
    } else {
      if (app.get('env') === 'development') {
        error = new HttpError(500, error.message)
        res.sendHttpError(error)
      } else {
        error = new HttpError(500)
        res.sendHttpError(error, error.message)
      }
  }
  })

  app.use(morgan('tiny', { stream }))

  // attach decoded jwt to res.locals.decodedToken
  app.use(getDecodedJwt())

  // routes
  app.get('/', (req, res) => {
    res.send('Up and running.')
  })

  app.use('/auth', authRouter)
  StartGraphQL(app)
}
