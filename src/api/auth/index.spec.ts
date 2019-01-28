/* tslint:disable no-unused-expression no-var-requires */
import * as chai from 'chai'
import * as jwt from 'jsonwebtoken'
import 'mocha'
import validator from 'validator'
import settings from '../../config/settings'
import Server from '../../server'

chai.use(require('chai-http'))
const expect = chai.expect

describe('auth endpoint', function() {
  this.timeout(0)
  const baseUrl = `http://127.0.0.1:${settings.port}/auth`
  const email = 'test@gmail.com'
  const password = 'testPassword'
  let token = ''

  const server = new Server()

  before((done) => {
    server.init(done)
  })

  after((done) => {
    server.close(done)
  })

  /**
   * This test does nothing but makes sure that the server persists across all
   * of the tests in this module.
   */
  it('returns true', (done) => {
    expect(true).to.be.true
    done()
  })

  describe('POST /auth/register', () => {
    it('returns an error when email is invalid', (done) => {
      chai.request(baseUrl)
      .post('/register')
      .type('form')
      .send({
        email: 'test@gmail', // invalid email
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        done()
      })
    })

    it("returns an error when email isn't in the body", (done) => {
      chai.request(baseUrl)
      .post('/register')
      .type('form')
      .send({
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        done()
      })
    })

    it("returns an error when password isn't in the body", (done) => {
      chai.request(baseUrl)
      .post('/register')
      .type('form')
      .send({
        email,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        done()
      })
    })

    it('returns a success message when user was registered', (done) => {
      chai.request(baseUrl)
      .post('/register')
      .type('form')
      .send({
        email,
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.haveOwnProperty('success')
        expect(res.body.success).to.be.true
        done()
      })
    })

    it('returns an error when email is a duplicate', (done) => {
      chai.request(baseUrl)
      .post('/register')
      .type('form')
      .send({
        email, // duplicate email
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        expect(res.body.errors).to.have.lengthOf(1)
        done()
      })
    })
  })

  describe('POST /auth/login', () => {
    it('returns an error when email is invalid', (done) => {
      chai.request(baseUrl)
      .post('/login')
      .type('form')
      .send({
        email: 'test@gmail', // invalid email
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        done()
      })
    })

    it("returns an error when email isn't in the body", (done) => {
      chai.request(baseUrl)
      .post('/login')
      .type('form')
      .send({
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        done()
      })
    })

    it("returns an error when password isn't in the body", (done) => {
      chai.request(baseUrl)
      .post('/login')
      .type('form')
      .send({
        email,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')
        done()
      })
    })

    it('returns a JWT in the auth header and response body when when email and password are valid', (done) => {
      chai.request(baseUrl)
      .post('/login')
      .type('form')
      .send({
        email,
        password,
      })
      .end((err, res) => {
        const bearerToken = res.get('Authorization').split(' ')[1]

        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.header('Authorization')
        expect(validator.isJWT(bearerToken))
        expect(res.body).to.haveOwnProperty('token')
        expect(res.body.token).to.be.a('string')
        expect(validator.isJWT(res.body.token)).to.be.true

        // save token for following tests
        token = bearerToken
        done()
      })
    })
  })

  describe('POST /auth/refresh', () => {
    it('returns an error when no auth header was sent', (done) => {
      chai.request(baseUrl)
      .post('/refresh')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')

        done()
      })
    })

    it('returns an error when no token is included in the auth header', (done) => {
      chai.request(baseUrl)
      .post('/refresh')
      .set('Authorization', 'Bearer')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')

        done()
      })
    })

    it('returns an error when provided an ill-formatted token in the auth header', (done) => {
      chai.request(baseUrl)
      .post('/refresh')
      .set('Authorization', 'Bearer thisIsNotAToken')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')

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
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.haveOwnProperty('errors')

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
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.haveOwnProperty('errors')

          done()
        })
      }, 10) // delay 10ms for the token to expire
    })

    it('returns a refreshed token when provided a valid token in the auth header', (done) => {
      chai.request(baseUrl)
      .post('/refresh')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        const bearerToken = res.get('Authorization').split(' ')[1]

        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.have.header('Authorization')
        expect(validator.isJWT(bearerToken))
        expect(res.body).to.haveOwnProperty('token')
        expect(res.body.token).to.be.a('string')
        expect(validator.isJWT(res.body.token)).to.be.true

        done()
      })
    })
  })

  // TODO: POST /auth/forgot
  // TODO: GET /auth/reset/:token
  // TODO: POST /auth/reset/:token
})
