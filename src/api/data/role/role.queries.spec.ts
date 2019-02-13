/* tslint:disable no-unused-expression newline-per-chained-call */
import { queryResolvers, queryTypes } from './role.queries'

describe('role queries', () => {
  it('should export queryTypes', (done: () => void) => {
    expect(typeof queryTypes).toBe('function')
    // expect(typeof queryTypes()).toBe('array')
    done()
  })

  it('should export queryResolvers', (done: () => void) => {
    expect(typeof queryResolvers).toBe('object')
    expect(queryResolvers).toHaveProperty('Query')
    done()
  })
})
