import { NextFunction, Request, Response } from 'express'
import * as http from 'http'

/**
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
  /**
   * @static
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {(Response | void)}
   * @memberof HttpError
   */
  public static errorHandler(error: Error, req: Request, res: Response, next: NextFunction): Response | void {
    if (res.headersSent) {
      return next(error)
    }
    res.status(500)
    res.send('Oops.')
  }

  public status: number
  public message: string
  public name: string

  /**
   * Creates an instance of HttpError.
   * @param {number} [status]
   * @param {string} [name]
   * @param {any} [message]
   * @memberof HttpError
   */
  constructor(status?: number, name?: string, message?: any) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.status = status || 500
    this.name = name
    this.message = message || http.STATUS_CODES[this.status] || 'Error'
  }
}

export default HttpError
