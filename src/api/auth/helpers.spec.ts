/* tslint:disable no-unused-expression */
import * as bcrypt from 'bcryptjs'
import { expect } from 'chai'
import 'mocha'
import { logger } from '../../config/logger'
import { hashPassword, validatePassword } from './helpers'

describe('auth helper hashPassword', () => {
  const plaintext: string = 'testPassword'

  it('should return a legitimate bcrypt-hashed password', (done) => {
    const hashedPassword = hashPassword(plaintext)

    expect(bcrypt.compareSync(plaintext, hashedPassword)).to.be.true
    done()
  })
})

describe('auth helper validatePassword', () => {
  const plaintext: string = 'testPassword'

  it('should return true if passwords match', (done) => {
    const hashedPassword = hashPassword(plaintext)

    expect(validatePassword(plaintext, hashedPassword)).to.be.true
    done()
  })

  it("should return false if passwords don't match", (done) => {
    const hashedPassword = hashPassword(plaintext)

    expect(validatePassword('theWrongPassword', hashedPassword)).to.be.false
    done()
  })
})
