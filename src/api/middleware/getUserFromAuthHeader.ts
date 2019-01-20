import * as jwt from 'jsonwebtoken'
import { Brackets } from 'typeorm'
import * as util from 'util'
import { logger } from '../../config/logger'
import { User } from '../data/user/user.entity'

const AUTH_HEADER = 'authorization'

/**
 * Returns a decoded JWT from an auth HTTP bearer token.
 * https://www.thepolyglotdeveloper.com/2018/07/protect-graphql-properties-jwt-nodejs-application/
 * @function
 * @param {String} bearerToken - The authorization bearer token in the format "Bearer <token>".
 */
const getUserFromAuthHeader = async (bearerToken: string) => {
  const bearerTokenArray = bearerToken.split(' ')
  if (bearerTokenArray.length !== 2 || bearerTokenArray[0].toLowerCase() !== 'bearer') {
    logger.debug('getUserFromAuthHeader() - Authorization bearer token was not formatted properly or did not exist.')
    return {}
  }

  const decodedToken = jwt.verify(bearerTokenArray[1], process.env.SECRET_KEY) // synchronous

  return await User.createQueryBuilder('user')
  .select('user.id') // only select necessary fields
  // .addSelect('user.lastPasswordReset')
  .where('user.id = :id', { id: decodedToken.id })
  .andWhere(new Brackets((qb) => {
    // prevent user auth if lastPasswordReset is after the jwt's iat value
    qb.where('user.lastPasswordReset < :iat', { iat: new Date(decodedToken.iat * 1000) })
    .orWhere('user.lastPasswordReset IS NULL')
  }))
  .getOne()
  .then((user) => {
    if (!user) { return {} }
    return user
  })
  .catch((error) => {
    logger.error(error)
    return {}
  })

  // jwt.verify(bearerTokenArray[1], process.env.SECRET_KEY, async (err, decodedToken) => {
  //   if (err) {
  //     logger.debug('getUserFromAuthHeader() - Invalid JWT')
  //     return {}
  //   }

  //   // Also check for valid JWT against user.lastPasswordReset
  //   await User.createQueryBuilder('user')
  //   .select('id')
  //   .addSelect('user.lastPasswordReset')
  //   .where('user.id = :id', { id: decodedToken.id })
  //   .andWhere(new Brackets((qb) => {
  //     // prevent user auth if lastPasswordReset is after the jwt's iat value
  //     qb.where('user.lastPasswordReset < :iat', { iat: new Date(decodedToken.iat * 1000) })
  //     .orWhere('user.lastPasswordReset IS NULL')
  //   }))
  //   .getOne()
  //   .then((user) => {
  //     if (!user) { return }

  //     logger.debug(`user.lastPasswordReset: ${user.lastPasswordReset}`)
  //     logger.debug(`decodedToken.iat: ${new Date(decodedToken.iat * 1000)}`)

  //     return user
  //   })
  //   .catch((error) => {
  //     logger.error(error)
  //     return {}
  //   })
  // })
}

export default getUserFromAuthHeader
