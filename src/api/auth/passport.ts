import * as passport from 'passport'
import * as JWT from 'passport-jwt'
import * as Local from 'passport-local'
import { Brackets } from 'typeorm'
import { logger } from '../../config/logger'
import settings from '../../config/settings'
import { User } from '../data/user/user.entity'
import { validatePassword } from './helpers'

passport.use(
  new Local.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done: CallableFunction) => {
      try {
        const user: User = await User.createQueryBuilder('user')
          .addSelect('user.password')
          .where('user.email = :email', { email })
          .getOne()

        if (!user) {
          return done(null, false)
        }
        if (!validatePassword(password, user.password)) {
          return done(null, false)
        }
        return done(null, user)
      } catch (err) {
        logger.error(err)
        return done(err, false)
      }
    },
  ),
)

passport.use(
  new JWT.Strategy(
    {
      jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.secretKey,
    },
    async (data: any, done: CallableFunction) => {
      try {
        const user: User = await User.createQueryBuilder('user')
          .addSelect('user.lastPasswordReset')
          .where('user.id = :id', { id: data.id })
          .andWhere(
            new Brackets((qb) => {
              // prevent user auth if lastPasswordReset is after the jwt's iat value
              qb.where('user.lastPasswordReset < :iat', {
                iat: new Date(data.iat * 1000),
              }).orWhere('user.lastPasswordReset IS NULL')
            }),
          )
          .getOne()

        if (!user) {
          return done(null, false)
        }

        logger.debug(`user.lastPasswordReset: ${user.lastPasswordReset}`)
        logger.debug(`data.iat: ${new Date(data.iat * 1000)}`)

        return done(null, user)
      } catch (err) {
        logger.error(err)
        return done(err)
      }
    },
  ),
)

export const isAuthenticated = passport.authenticate('jwt', {
  session: false,
  failWithError: true,
})
