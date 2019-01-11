import { NextFunction, Request } from 'express'
import { HttpError } from '../../config/errorHandler'

/**
 * Based 100% on https://github.com/flakolefluk/express-required-fields
 */
const pick = (obj: any, ...properties: string[]): any =>
  Object.keys(obj)
    .filter((key) => properties.indexOf(key) > -1)
    .reduce(
      (result, key) =>
        Object.assign(result, {
          [key]: obj[key],
        }),
      {},
    )

interface IRequiredOptions {
  acceptQuery?: boolean
  acceptHeaders?: boolean
  showRequired?: boolean
  showReceived?: boolean
  errorStatus?: number
  message?: string
}

// accepts an array of strings of the required fields, and an options object
/**
 * Add required fields to req object.
 * @function
 * @param {array} fields - fields that are required in req.params
 */
const requiredFields = (fields: string[], opts: IRequiredOptions = {}) => (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  const data = {
    ...(opts.acceptQuery ? req.query : {}),
    ...(opts.acceptHeaders ? req.headers : {}),
    ...req.body,
  }

  const showRequired =
    opts.showRequired !== undefined ? opts.showRequired : true

  const showReceived =
    opts.showReceived !== undefined ? opts.showReceived : true

  fields.every((arg) => Object.keys(data).indexOf(arg) > -1)
    ? next()
    : res.sendHttpError(new HttpError(
      400,
      'Missing required fields',
      opts.message || {
        required: showRequired ? fields.join(', ') : '',
        received: Object.keys(pick(data, ...fields)).join(', '),
      },
    ))
}

export default requiredFields
