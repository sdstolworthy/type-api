/* tslint:disable no-unused-expression */
import { PubSub } from 'apollo-server-express'
import { pubsub } from './subscriptions'

describe('GraphQL Subscriptions', () => {
  it('should export a pubsub instance', () => {
    expect(pubsub).toBeDefined
    expect(pubsub).toBeInstanceOf(PubSub)
  })
})
