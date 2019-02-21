/* tslint:disable no-unused-expression newline-per-chained-call */
import index from './index'

describe('user/index', () => {
  it('should export an object with `types` and `resolvers`', () => {
    expect(index).toHaveProperty('types')
    expect(index).toHaveProperty('resolvers')
  })

  it('should have a Query property on the resolvers', () => {
    expect(index.resolvers).toHaveProperty('Query')
  })
})
