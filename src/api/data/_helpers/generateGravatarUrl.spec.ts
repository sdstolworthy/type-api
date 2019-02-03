/* tslint:disable no-unused-expression */
import { expect } from 'chai'
import 'mocha'
import * as validator from 'validator'
import generateGravatarUrl from './generateGravatarUrl'

describe('generateGravatarUrl', () => {
  const email: string = 'randomemail@gmail.com'
  const result: string = generateGravatarUrl(email)

  it('should return a valid url pointing to gravatar.com', (done: () => void) => {
    expect(result).to.be.a('string')
    expect(validator.isURL(result)).to.be.true
    expect(result.indexOf('www.gravatar.com')).to.be.greaterThan(-1)
    done()
  })

  it('should default to "identicon"', (done: () => void) => {
    expect(result.indexOf('?d=identicon')).to.be.greaterThan(-1)
    done()
  })
})
