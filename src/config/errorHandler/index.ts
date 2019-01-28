import { NextFunction, Request, Response } from 'express'
import * as http from 'http'

// https://stackoverflow.com/a/32749533/5623385

/**
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
  public status: number

  /**
   * Creates an instance of HttpError.
   * @param {number} [status]
   * @param {string} [name]
   * @param {any} [message]
   * @memberof HttpError
   */
  constructor(status: number = 500, name?: string, message?: any) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.status = status
    this.name = name || this.constructor.name || 'Error'
    this.message = message || http.STATUS_CODES[this.status] || 'Error'
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

export default HttpError
