/* tslint:disable no-unused-expression no-var-requires newline-per-chained-call no-string-literal */
import * as jwt from 'jsonwebtoken'
import * as request from 'request-promise-native'
import { Connection, createConnection } from 'typeorm'
import validator from 'validator'
import { User } from '../src/api/data/user/user.entity'
import settings from '../src/config/settings'
import Server from '../src/server'

describe('auth endpoint', () => {
  let connection: Connection
  const dbInitializedSeparately: boolean = true
  const ONE_MINUTE: number = 60000
  const ONE_HOUR: number = 3600000
  const baseUrl: string = `http://127.0.0.1:${settings.port}/auth`
  const email: string = 'test@gmail.com'
  const password: string = 'testPassword'
  let jwtToken: string = ''
  let passwordResetToken: string = ''

  const server: Server = new Server()

  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: [
        '../src/**/*.entity.ts',
      ],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })
    await server.up(dbInitializedSeparately)
  })

  afterAll(async () => {
    await server.down()
    await connection.close()
  })

  /**
   * This test does nothing but makes sure that the server persists across all
   * of the tests in this module.
   */
  it('returns true', () => {
    expect(true).toBeTruthy
  })

  describe('POST /auth/register', () => {
    it('returns an error when email is invalid', () => {
      request
        .post(baseUrl + '/register')
        .form({
          email: 'test@gmail', // invalid email
          password,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when email isn't in the body", () => {
      request
        .post(baseUrl + '/register')
        .form({
          password,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when password isn't in the body", () => {
      request
        .post(baseUrl + '/register')
        .form({
          email,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns a success message when user was registered', () => {
      request
        .post(baseUrl + '/register')
        .form({
          email,
          password,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('success')
          expect(res.body.success).toBeTruthy
        })
    })

    it('returns an error when email is a duplicate', () => {
      request
        .post(baseUrl + '/register')
        .form({
          email, // duplicate email
          password,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors).toHaveLength(1)
        })
    })
  })

  describe('POST /auth/login', () => {
    it('returns an error when email is invalid', () => {
      request
        .post(baseUrl + '/login')
        .form({
          email: 'test@gmail', // invalid email
          password,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when email isn't in the body", () => {
      request
        .post(baseUrl + '/login')
        .form({
          password,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when password isn't in the body", () => {
      request
        .post(baseUrl + '/login')
        .form({
          email,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns a JWT in the auth header and response body when when email and password are valid', () => {
      request
        .post(baseUrl + '/login')
        .form({
          email,
          password,
        })
        .then((err, res) => {
          const bearerToken = res.get('Authorization').split(' ')[1]

          expect(err).toBeNull
          expect(res.status).toBe(200)
          expect(validator.isJWT(bearerToken)) // can't use validator to test for jwt until typedef is created
          expect(res.body).toHaveProperty('token')
          expect(typeof res.body.token).toBe('string')
          expect(validator.isJWT(res.body.token)).toBeTruthy

          // save token for following tests
          jwtToken = bearerToken
        })
    })
  })

  describe('POST /auth/refresh', () => {
    const requestOptions = {
      method: 'POST',
      uri: baseUrl + '/refresh',
    }

    it('returns an error when no auth header was sent', () => {
      request
        .post(baseUrl + '/refresh')
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when no token is included in the auth header', async () => {
      request({
        ...requestOptions,
        headers: {
          Authorization: 'Bearer ',
        },
      })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when provided an ill-formatted token in the auth header', () => {
      request({
        ...requestOptions,
        headers: {
          Authorization: 'Bearer thisIsNotAToken',
        },
      })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when provided a token with a bad user.id in the auth header', () => {
      const badIdToken = jwt.sign(
        { id: -2 }, // not a user id that's in use
        settings.secretKey,
        { expiresIn: '5s' },
      )

      request({
        ...requestOptions,
        headers: {
          Authorization: `Bearer ${badIdToken}`,
        },
      })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when provided an expired token in the auth header', () => {
      const expiredToken = jwt.sign(
        { id: 1 },
        settings.secretKey,
        { expiresIn: '2ms' },
      )

      setTimeout(() => {
        request({
          ...requestOptions,
          headers: {
            Authorization: `Bearer ${expiredToken}`,
          },
        })
          .then((err, res) => {
            expect(err).toBeNull
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('errors')
          })
      }, 10) // delay 10ms for the token to expire
    })

    it('returns a refreshed token when provided a valid token in the auth header', () => {
      request({
        ...requestOptions,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((err, res) => {
          const bearerToken = res.get('Authorization').split(' ')[1]

          expect(err).toBeNull
          expect(res.status).toBe(200)
          expect(validator.isJWT(bearerToken))
          expect(res.body).toHaveProperty('token')
          expect(typeof res.body.token).toBe('string')
          expect(validator.isJWT(res.body.token)).toBeTruthy
        })
    })
  })

  describe('POST /auth/forgot', () => {
    // TODO: test that email is sent

    it("returns an error when email isn't in the body", () => {
      request
        .post(baseUrl + '/forgot')
        .form({})
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when no user exists with that email', () => {
      request
        .post(baseUrl + '/forgot')
        .form({
          email: 'nottherightemail@gmail.com',
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('sets the user.resetPasswordToken', () => {
      request
        .post(baseUrl + '/forgot')
        .form({
          email,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(200)

          User.createQueryBuilder('user')
          .where('email = :email', { email })
          .addSelect('user.resetPasswordToken')
          .getOne()
          .then((user) => {
            expect(typeof user.resetPasswordToken).toBe('string')
            passwordResetToken = user.resetPasswordToken
          })
        })
    })

    it('sets the user.resetPasswordExpires to one hour from now', () => {
      request
        .post(baseUrl + '/forgot')
        .form({
          email,
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(200)

          User.createQueryBuilder('user')
          .where('email = :email', { email })
          .addSelect('user.resetPasswordToken')
          .addSelect('user.resetPasswordExpires')
          .getOne()
          .then((user) => {
            passwordResetToken = user.resetPasswordToken

            expect(typeof user.resetPasswordExpires).toBe('string')
            expect(new Date(Date.now() + ONE_HOUR).getTime())
              .toBeCloseTo(user.resetPasswordExpires.getTime(), ONE_MINUTE)
          })
        })
      })
  })

  describe('POST /auth/reset/:token', () => {
    // TODO: test that email is sent

    it("returns an error when password isn't in the body", () => {
      request
        .post(baseUrl + `/reset/${passwordResetToken}`)
        .form({})
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when the password reset token is invalid', () => {
      request
        .post(baseUrl + '/reset/invalidToken')
        .form({
          password: 'newPassword',
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('updates the user.lastPasswordReset to now and clears user.resetPasswordToken', () => {
      request
        .post(baseUrl + `/reset/${passwordResetToken}`)
        .form({
          password: 'newPassword',
        })
        .then((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(200)

          User.createQueryBuilder('user')
          .where('email = :email', { email })
          .addSelect('user.resetPasswordToken')
          .addSelect('user.lastPasswordReset')
          .getOne()
          .then((user) => {
            expect(user.resetPasswordToken).toBeNull
            // expect(typeof user.lastPasswordReset).to.exist
            expect(new Date().getTime()).toBeCloseTo(user.lastPasswordReset.getTime(), ONE_MINUTE)
          })
        })
    })
  })
})
