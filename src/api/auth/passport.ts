import * as passport from 'passport'
import * as JWT from 'passport-jwt'
import * as Local from 'passport-local'
import { logger } from '../../config/logger'
import { User } from '../data/user/User.entity'
import { validatePassword } from './helpers'

const tokenExpirationPeriod = '7d'

passport.use(new Local.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email })
    .getOne()
    .then((user) => {
      if (!user) { return done(null, false) }
      if (!validatePassword(user, password)) { return done(null, false) }
      return done(null, user)
    })
    .catch((err) => {
      logger.error(err)
      return done(err, false)
    })
  },
))

passport.use(new JWT.Strategy({
  jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
}, async (data, done) => {
  try {
    User.findOneOrFail({ id: data.id })
    .then((user) => {
      if (!user) { return done(null, false) }
      return done(null, user)
    })
    .catch((err) => {
      logger.error(err)
      return done(err, false)
    })
  } catch (err) {
    logger.error(err)
    return done(err)
  }
}))

const isAuthenticated = passport.authenticate('jwt', { session: false })

export {
  isAuthenticated,
  tokenExpirationPeriod,
}
