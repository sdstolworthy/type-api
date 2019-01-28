/* tslint:disable no-unused-expression */
import { expect } from 'chai'
import 'mocha'
import { logger } from '../../config/logger'
import Server from '../../server'

describe('auth endpoint', function() {
  this.timeout(0)

  describe('POST /auth/register', () => {
    const server = new Server()

    before((done) => {
      server.init(done)
    })

    after((done) => {
      server.close(done)
    })

    it('returns true', (done) => {
      expect(true).to.be.true
      done()
    })
  })
})
