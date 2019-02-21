/* tslint:disable no-unused-expression newline-per-chained-call */
import randomString from './randomString'

describe('randomString', () => {
  it('should return a random string of length x when given x (int)', (done: () => void) => {
    const length: number = 10
    const result: string = randomString(length)

    expect(typeof result).toBe('string')
    expect(result).toHaveLength(length)
    done()
  })

  it('should return a random string of length 10 when not given any length', (done: () => void) => {
    const result: string = randomString()

    expect(typeof result).toBe('string')
    expect(result).toHaveLength(10)
    done()
  })
})
