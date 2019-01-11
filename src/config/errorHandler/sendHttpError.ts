import { NextFunction, Request } from 'express'
import { HttpError } from './index'

/**
 * @exports
 * @param {Request} req
 * @param {*} res
 * @param {NextFunction} next
 */
const sendHttpErrorModule: (
  req: any, res: any, next: NextFunction,
) => void = (req: Request, res: any, next: NextFunction): void => {
  res.sendHttpError = (error: HttpError): void => {
    res.status(error.status)
    // • if this looks like an AJAX request
    // • if this request has a "json" content-type AND ALSO has its "Accept" header set
    // • if this request DOESN'T explicitly want HTML
    if (
      req.xhr
      || req.is('json')
      || (req.is('json') && req.get('Accept'))
      || !(req.get('Accept') && req.get('Accept').indexOf('html') !== -1)
    ) {
      res.json({
        status: error.status,
        name: error.name,
        message: error.message,
      })
    } else {
      res.status(500)
      res.send('We did a bad thing.')
    }
  }

  next()
}

export default sendHttpErrorModule
