/* tslint:disable no-unused-expression */
import { queryResolvers, queryTypes } from './user.queries'

describe('user queries', () => {
  it('should export queryTypes', () => {
    expect(typeof queryTypes).toBe('function')
    // expect(typeof queryTypes()).toBe('array')
  })

  it('should export queryResolvers', () => {
    expect(typeof queryResolvers).toBe('object')
    expect(queryResolvers).toHaveProperty('Query')
  })
})
