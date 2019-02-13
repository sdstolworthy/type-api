/* tslint:disable no-unused-expression no-var-requires newline-per-chained-call no-string-literal */
import * as jwt from 'jsonwebtoken'
import request from 'request'
import validator from 'validator'
import settings from '../../config/settings'
import Server from '../../server'
import { User } from '../data/user/user.entity'

describe('auth endpoint', function() {
  this.timeout(20000) // 20 seconds
  const ONE_MINUTE: number = 60000
  const ONE_HOUR: number = 3600000
  const baseUrl: string = `http://127.0.0.1:${settings.port}/auth`
  const email: string = 'test@gmail.com'
  const password: string = 'testPassword'
  let jwtToken: string = ''
  let passwordResetToken: string = ''

  const server: Server = new Server()

  beforeAll((done) => {
    server.up(done)
  })

  afterAll((done) => {
    server.down(done)
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
      request(baseUrl)
        .post('/register')
        .type('form')
        .send({
          email: 'test@gmail', // invalid email
          password,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when email isn't in the body", () => {
      request(baseUrl)
        .post('/register')
        .type('form')
        .send({
          password,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when password isn't in the body", () => {
      request(baseUrl)
        .post('/register')
        .type('form')
        .send({
          email,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns a success message when user was registered', () => {
      request(baseUrl)
        .post('/register')
        .type('form')
        .send({
          email,
          password,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('success')
          expect(res.body.success).toBeTruthy
        })
    })

    it('returns an error when email is a duplicate', () => {
      request(baseUrl)
        .post('/register')
        .type('form')
        .send({
          email, // duplicate email
          password,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
          expect(res.body.errors).toHaveLength(1)
        })
    })
  })

  describe('POST /auth/login', () => {
    it('returns an error when email is invalid', () => {
      request(baseUrl)
        .post('/login')
        .type('form')
        .send({
          email: 'test@gmail', // invalid email
          password,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when email isn't in the body", () => {
      request(baseUrl)
        .post('/login')
        .type('form')
        .send({
          password,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it("returns an error when password isn't in the body", () => {
      request(baseUrl)
        .post('/login')
        .type('form')
        .send({
          email,
        })
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns a JWT in the auth header and response body when when email and password are valid', () => {
      request(baseUrl)
        .post('/login')
        .type('form')
        .send({
          email,
          password,
        })
        .end((err, res) => {
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
    it('returns an error when no auth header was sent', () => {
      request(baseUrl)
        .post('/refresh')
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when no token is included in the auth header', () => {
      request(baseUrl)
        .post('/refresh')
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')
        })
    })

    it('returns an error when provided an ill-formatted token in the auth header', (done) => {
      chai.request(baseUrl)
      .post('/refresh')
      .set('Authorization', 'Bearer thisIsNotAToken')
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')

        done()
      })
    })

    it('returns an error when provided a token with a bad user.id in the auth header', (done) => {
      const badIdToken = jwt.sign(
        { id: -2 }, // not a user id that's in use
        settings.secretKey,
        { expiresIn: '5s' },
      )

      chai.request(baseUrl)
      .post('/refresh')
      .set('Authorization', `Bearer ${badIdToken}`)
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')

        done()
      })
    })

    it('returns an error when provided an expired token in the auth header', (done) => {
      const expiredToken = jwt.sign(
        { id: 1 },
        settings.secretKey,
        { expiresIn: '2ms' },
      )

      setTimeout(() => {
        chai.request(baseUrl)
        .post('/refresh')
        .set('Authorization', `Bearer ${expiredToken}`)
        .end((err, res) => {
          expect(err).toBeNull
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('errors')

          done()
        })
      }, 10) // delay 10ms for the token to expire
    })

    it('returns a refreshed token when provided a valid token in the auth header', (done) => {
      chai.request(baseUrl)
      .post('/refresh')
      .set('Authorization', `Bearer ${jwtToken}`)
      .end((err, res) => {
        const bearerToken = res.get('Authorization').split(' ')[1]

        expect(err).toBeNull
        expect(res.status).toBe(200)
        expect(validator.isJWT(bearerToken))
        expect(res.body).toHaveProperty('token')
        expect(typeof res.body.token).toBe('string')
        expect(validator.isJWT(res.body.token)).toBeTruthy

        done()
      })
    })
  })

  describe('POST /auth/forgot', () => {
    // TODO: test that email is sent

    it("returns an error when email isn't in the body", (done) => {
      chai.request(baseUrl)
      .post('/forgot')
      .type('form')
      .send()
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        done()
      })
    })

    it('returns an error when no user exists with that email', (done) => {
      chai.request(baseUrl)
      .post('/forgot')
      .type('form')
      .send({
        email: 'nottherightemail@gmail.com',
      })
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        done()
      })
    })

    it('sets the user.resetPasswordToken', (done) => {
      chai.request(baseUrl)
      .post('/forgot')
      .type('form')
      .send({
        email,
      })
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(200)

        User.createQueryBuilder('user')
        .where('email = :email', { email })
        .addSelect('user.resetPasswordToken')
        .getOne()
        .then((user) => {
          expect(typeof user.resetPasswordToken).toBe('string')
          passwordResetToken = user.resetPasswordToken
          done()
        })
      })
    })

    it('sets the user.resetPasswordExpires to one hour from now', (done) => {
      chai.request(baseUrl)
      .post('/forgot')
      .type('form')
      .send({
        email,
      })
      .end((err, res) => {
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
          done()
        })
      })
    })
  })

  describe('POST /auth/reset/:token', () => {
    // TODO: test that email is sent

    it("returns an error when password isn't in the body", (done) => {
      chai.request(baseUrl)
      .post(`/reset/${passwordResetToken}`)
      .type('form')
      .send()
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        done()
      })
    })

    it('returns an error when the password reset token is invalid', (done) => {
      chai.request(baseUrl)
      .post('/reset/invalidToken')
      .type('form')
      .send({
        password: 'newPassword',
      })
      .end((err, res) => {
        expect(err).toBeNull
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        done()
      })
    })

    it('updates the user.lastPasswordReset to now and clears user.resetPasswordToken', (done) => {
      chai.request(baseUrl)
      .post(`/reset/${passwordResetToken}`)
      .type('form')
      .send({
        password: 'newPassword',
      })
      .end((err, res) => {
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
          done()
        })
      })
    })
  })
})
