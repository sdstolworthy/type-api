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
        done()
      })
    })
  })
})
