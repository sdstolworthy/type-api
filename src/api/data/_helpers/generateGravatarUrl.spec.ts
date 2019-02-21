/* tslint:disable no-unused-expression newline-per-chained-call */
import * as validator from 'validator'
import generateGravatarUrl from './generateGravatarUrl'

describe('generateGravatarUrl', () => {
  const email: string = 'randomemail@gmail.com'
  const result: string = generateGravatarUrl(email)

  it('should return a valid url pointing to gravatar.com', (done: () => void) => {
    expect(typeof result).toBe('string')
    expect(validator.isURL(result)).toBeTruthy
    expect(result.indexOf('www.gravatar.com')).toBeGreaterThan(-1)
    done()
  })

  it('should default to "identicon"', (done: () => void) => {
    expect(result.indexOf('?d=identicon')).toBeGreaterThan(-1)
    done()
  })
})
