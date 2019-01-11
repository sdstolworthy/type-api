import * as passport from 'passport'
import * as JWT from 'passport-jwt'
import * as Local from 'passport-local'
import User from '../api/graphql/user/User.model'

const tokenExpirationPeriod = '7d'

passport.use(new Local.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.findOne({ email })
    .select('+password')
    .exec((err, user) => {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      if (!user.verifyPassword(password)) { return done(null, false) }
      return done(null, user)
    })
  },
))

passport.use(new JWT.Strategy({
  jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
}, async (data, done) => {
  try {
    User.findById(data.id)
    .select('_id email')
    .exec((err, user) => {
      if (err) { return done(err, false) }
      if (!user) { return done(null, false) }
      return done(null, user)
    })
  } catch (err) {
    return done(err)
  }
}))

const isAuthenticated = passport.authenticate('jwt', { session: false })

export {
  isAuthenticated,
  tokenExpirationPeriod,
}
