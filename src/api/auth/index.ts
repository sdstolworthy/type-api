import async from 'async'
import * as crypto from 'crypto'
import { NextFunction, Request, Response, Router } from 'express'
import { check, validationResult } from 'express-validator/check'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import { logger } from '../../config/logger'
import sendMail from '../../config/mailer'
import settings from '../../config/settings'
import { User } from '../data/user/user.entity'
import requiredFields from '../middleware/requiredFields'
import { hashPassword } from './helpers'
import { isAuthenticated, tokenExpirationPeriod } from './passport'

const ONE_HOUR = 3600000
const router = Router()

/**
 * POST /auth/register
 * Create a new user with:
 *  email: req.body.email
 *  password: req.body.password
 */
router.post('/register',
  [check('email').isEmail(), check('password').isString()],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.error(errors.array())
      res.locals.errors.push.apply(res.locals.errors, errors.array())
      return next(errors.array())
    }

    User.create({
      email: req.body.email,
      password: hashPassword(req.body.password),
    }).save().then((user) => {
      res.json({
        success: true,
        email: user.email,
      })
    }).catch((err) => {
      res.locals.errors.push({
        msg: err.detail,
      })
      logger.error(err)
      next(err)
    })
  },
)

/**
 * /auth/login
 * Log an existing user in and return a valid, signed JWT.
 */
router.post('/login',
  [check('email').exists(), check('password').exists()],
  passport.authenticate('local', { session: false, failWithError: true }),
  (req: any, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.error(errors.array())
      res.locals.errors.push.apply(res.locals.errors, errors.array())
      return next(errors.array())
    }

    const token = jwt.sign(
      { id: req.user.id },
      settings.secretKey,
      { expiresIn: tokenExpirationPeriod },
    )

    res.set({
      Authorization : `Bearer ${token}`,
    })

    return res.json({ token })
  },
)

/**
 * POST /auth/refresh
 * Return a refreshed, valid, signed JWT.
 * https://stackoverflow.com/a/26834685
 */
router.post('/refresh', isAuthenticated, (req: any, res: Response) => {
  const token = jwt.sign(
    { id: req.user.id },
    settings.secretKey,
    { expiresIn: tokenExpirationPeriod },
  )

  res.set({
    Authorization : `Bearer ${token}`,
  })

  return res.json({ token })
})

/**
 * POST /auth/forgot
 * Send email to user email address with password reset token.
 */
router.post('/forgot', [check('email').exists()], (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.error(errors.array())
    res.locals.errors.push.apply(res.locals.errors, errors.array())
    return next(errors.array())
  }

  async.waterfall([
    // generate 20-character random token.
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token)
      })
    },
    // find user with email from req.body.email, update user's password reset token.
    (token, done) => {
      User.findOneOrFail({ email: req.body.email }).then((user) => {
        user.resetPasswordToken = token
        user.resetPasswordExpires = new Date(Date.now() + ONE_HOUR)

        // let emailText = 'A password reset has been initiated on your account.\n'
        // emailText += 'To reset your password, please click this link:\n\n'
        // emailText += `http://${req.headers.host}/auth/reset/${token}\n\n`
        // emailText += 'If you did not initiate this password reset, you do not need to do anything.'

        user.save().then((savedUser) => {
          const data = {
            to: user.email,
            subject: 'Password reset',
            template: 'passwordResetRequest',
            link: `http://${req.headers.host}/auth/reset/${token}`,
          }

          sendMail(data, (err, body) => {
            if (err) {
              logger.error(err)
            }

            res.send('Password reset message sent.')
            return done(err, 'done')
          })
        }).catch((error) => {
          logger.error(error)
          done(error, false)
        })
      })
      .catch((err) => {
        logger.error(err)
        return done(err, false)
      })
    },
  ], (err) => {
    if (err) {
      if (err.name === 'EntityNotFound') {
        err.message = 'No user was found with that email.'
      }
      logger.error(err)
      return next(err)
    }
    return { success: true }
  })
})

/**
 * GET /auth/reset/:token
 * Returns the user with the reset token.
 */
router.get('/reset/:token', (req: Request, res: Response) => {
  // res.send('todo: token reset')
  User.createQueryBuilder('user')
  .where('user.resetPasswordToken = :token', { token: req.params.token })
  .andWhere('user.resetPasswordExpires > :now', { now: new Date() })
  .getOne()
  .then((user) => {
    if (!user) {
      res.send("Either that user doesn't exist or that token is invalid.")
    }
    res.send(user)
  })
  .catch((err) => {
    logger.error(err)
    res.send(err)
  })
})

/**
 * POST /auth/reset/:token
 * Flow to reset a user's password given a token.
 */
router.post('/reset/:token',
  requiredFields(['password']),
  (req: Request, res: Response, next: NextFunction) => {
    User.createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.resetPasswordToken = :token', { token: req.params.token })
    .andWhere('user.resetPasswordExpires > :now', { now: new Date() })
    .getOne()
    .then((user) => {
      if (!user) {
        return res.send("Either that user doesn't exist or that token is invalid.")
      }

      user.password = hashPassword(req.body.password)
      user.resetPasswordToken = null
      user.resetPasswordExpires = null
      user.lastPasswordReset = new Date()

      user.save().then((savedUser) => {
        const data = {
          to: user.email,
          subject: 'Password has been reset',
          text: `Your password has been reset at http://${req.headers.host}`,
        }

        sendMail(data, (err, body) => {
          res.send('Password reset message sent.')
        })
      })
    })
    .catch((err) => {
      logger.error(err)
      res.send(err)
    })
  },
)

export default router
