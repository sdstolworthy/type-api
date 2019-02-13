/* tslint:disable no-unused-expression newline-per-chained-call */
import * as bcrypt from 'bcryptjs'
import { logger } from '../../config/logger'
import { hashPassword, validatePassword } from './helpers'

describe('auth helper hashPassword', () => {
  const plaintext: string = 'testPassword'

  it('should return a legitimate bcrypt-hashed password', (done) => {
    const hashedPassword = hashPassword(plaintext)

    expect(bcrypt.compareSync(plaintext, hashedPassword)).toBeTruthy
    done()
  })
})

describe('auth helper validatePassword', () => {
  const plaintext: string = 'testPassword'

  it('should return true if passwords match', (done) => {
    const hashedPassword = hashPassword(plaintext)

    expect(validatePassword(plaintext, hashedPassword)).toBeTruthy
    done()
  })

  it("should return false if passwords don't match", (done) => {
    const hashedPassword = hashPassword(plaintext)

    expect(validatePassword('theWrongPassword', hashedPassword)).toBeTruthy
    done()
  })
})
