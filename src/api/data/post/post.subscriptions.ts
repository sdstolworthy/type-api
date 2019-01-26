import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { pubsub } from '../subscriptions'

export const subscriptions = {
  POST_ADDED: 'POST_ADDED',
}

const Subscription = gql`
  extend type Subscription {
    postAdded: Post
  }
`

export const subscriptionTypes = () => [ Subscription ]

export const subscriptionResolvers = {
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([subscriptions.POST_ADDED]),
    },
  },
}
