import * as bcrypt from 'bcrypt'
import { User } from '../data/user/User.entity'

const SALT_ROUNDS = 10

/**
 * Hash a plaintext password.
 * @function
 * @param {string} password - The plaintext password to be hashed.
 * @returns {string}
 */
export function hashPassword(password: string) {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

/**
 * Compare a given user's password with the given password. Return true if a match.
 * @function
 * @param {User} user
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.password)
}
