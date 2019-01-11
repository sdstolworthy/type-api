import * as dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as errorHandler from 'errorhandler'
import * as express from 'express'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as passport from 'passport'
import authRouter from './api/auth'
import { StartGraphQL } from './api/data'
import Cron from './config/cron'
import { HttpError } from './config/errorHandler'
import httpErrorModule from './config/errorHandler/sendHttpError'
import { stream } from './config/logger'

const app = express()

// cron
Cron.init()

// express
app.set('env', process.env.NODE_ENV || 'development')
app.set('port', process.env.PORT || 3000)

// middleware
app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

// error handler
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

// routes
app.use('/auth', authRouter)
StartGraphQL(app)

export default app
