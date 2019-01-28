/* tslint:disable no-unused-expression */
import * as bcrypt from 'bcrypt'
import { expect } from 'chai'
import 'mocha'
import { IEnv, run } from '../../app'
import { logger } from '../../config/logger'

describe('auth endpoint', function() {
  this.timeout(0)

  before((done) => {
    run(process.env as unknown as IEnv, done)
  })
  describe('POST /auth/register', () => {
    it('returns true', (done) => {
      expect(true).to.be.true
    })
  })
})
