import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

const AUTH_HEADER = 'authorization'

/**
 * Adds a decoded JWT from the Authorization Bearer header to the res.locals
 * object if the JWT exists. Otherwise, just next().
 * Decoded token will be accessible at res.locals.decodedToken
 * https://www.thepolyglotdeveloper.com/2018/07/protect-graphql-properties-jwt-nodejs-application/
 * @function
 */
const getDecodedJwt = () => (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers[AUTH_HEADER]
  if (authHeader) {
    const bearerToken = authHeader.split(' ')
    if (bearerToken.length === 2 && bearerToken[0].toLowerCase() === 'bearer') {
      jwt.verify(bearerToken[1], process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
          return res.status(401).send('Invalid authorization token')
        }
        res.locals.decodedToken = decodedToken
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
}

export default getDecodedJwt
