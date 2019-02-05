/* tslint:disable no-unused-expression newline-per-chained-call */
import { expect } from 'chai'
import 'mocha'
import randomString from './randomString'

describe('randomString', () => {
  it('should return a random string of length x when given x (int)', (done: () => void) => {
    const length: number = 10
    const result: string = randomString(length)

    expect(result).to.be.a('string')
    expect(result).to.have.lengthOf(length)
    done()
  })

  it('should return a random string of length 10 when not given any length', (done: () => void) => {
    const result: string = randomString()

    expect(result).to.be.a('string')
    expect(result).to.have.lengthOf(10)
    done()
  })
})
