import * as jwt from 'jsonwebtoken'
import * as util from 'util'
import { logger } from '../../config/logger'

const AUTH_HEADER = 'authorization'

/**
 * Returns a decoded JWT from an auth HTTP bearer token.
 * https://www.thepolyglotdeveloper.com/2018/07/protect-graphql-properties-jwt-nodejs-application/
 * @function
 * @param {String} bearerToken - The authorization bearer token in the format "Bearer <token>".
 *
 * TODO: should this function also check for existence of user and validity of
 * JWT in comparison with user.lastPasswordReset?
 */
const getDecodedJwt = (bearerToken: string) => {
  let token = {}
  const bearerTokenArray = bearerToken.split(' ')
  if (bearerTokenArray.length === 2 && bearerTokenArray[0].toLowerCase() === 'bearer') {
    jwt.verify(bearerTokenArray[1], process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        logger.debug('getDecodedJwt() - Invalid JWT')
        return
      }

      logger.debug(`getDecodedJwt() - ${util.inspect(decodedToken, {showHidden: false, depth: null})}`)
      token = decodedToken
    })
  } else {
    logger.debug('getDecodedJwt() - Authorization bearer token was not formatted properly or did not exist.')
  }
  return token
}

export default getDecodedJwt
