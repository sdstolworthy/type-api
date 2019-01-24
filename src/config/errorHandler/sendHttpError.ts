import { NextFunction, Request } from 'express'
import { HttpError } from './index'

/**
 * @exports
 * @param {Request} req
 * @param {*} res
 * @param {NextFunction} next
 */
export default function(
  error: any, req: any, res: any, next: NextFunction,
)  {
  if (res.headersSent) {
    return next(error)
  }
  if (typeof error === 'number') {
    error = new HttpError(error)
  }

  res.status(error.status)
  .json({
    status: error.status,
    name: error.name,
    message: error.message,
  })
  // next()
}
