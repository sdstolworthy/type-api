/* tslint:disable no-unused-expression */
import { ApolloServer } from 'apollo-server-express'
import server from './index'

describe('GraphQL server', () => {
  it('should export an Apollo Server', () => {
    expect(server).toBeDefined
    expect(server).toBeInstanceOf(ApolloServer)
  })

  it('should have a GraphQL path of "/graphql"', () => {
    expect(server.graphqlPath).toBe('/graphql')
  })

  it('should have a subscriptions path of "/graphql"', () => {
    expect(server.subscriptionsPath).toBe('/graphql')
  })

  // TODO: check request context for user
  // TODO: check subscriptions context for user
})
