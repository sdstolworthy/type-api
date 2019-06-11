import * as bcrypt from 'bcryptjs'

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
 * @param {string} plaintextPassword
 * @param {string} userPassword
 * @returns {boolean}
 */
export function validatePassword(
  plaintextPassword: string,
  userPassword: string,
): boolean {
  return bcrypt.compareSync(plaintextPassword, userPassword)
}
