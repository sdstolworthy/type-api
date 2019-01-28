/* tslint:disable no-unused-expression no-var-requires */
import * as chai from 'chai'
import 'mocha'
import settings from '../../config/settings'
import Server from '../../server'

chai.use(require('chai-http'))
const expect = chai.expect

describe('auth endpoint', function() {
  this.timeout(0)
  const baseUrl = `http://127.0.0.1:${settings.port}/auth`
  const email = 'test@gmail.com'

  describe('POST /auth/register', () => {
    const server = new Server()

    before((done) => {
      server.init(done)
    })

    after((done) => {
      server.close(done)
    })

    it('returns an error when email is invalid', (done) => {
      chai.request(baseUrl)
      .post('/register')
      .type('form')
      .send({
        email: 'test@gmail', // invalid email
        password: 'testPassword',
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
        password: 'testPassword',
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
        email: 'test@example.com',
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
        password: 'testPassword',
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
        password: 'testPassword2',
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
})
