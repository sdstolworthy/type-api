/* tslint:disable no-unused-expression */
import { resolvers, typeDefs } from './schema'

describe('GraphQL schema', () => {
  it('should export resolvers', () => {
    expect(resolvers).toBeDefined
  })

  it('should export typedefs', () => {
    expect(typeDefs).toBeDefined
  })
})
