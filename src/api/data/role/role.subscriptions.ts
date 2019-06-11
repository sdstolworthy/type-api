import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { pubsub } from '../subscriptions'

export const subscriptions = {
  ROLE_ADDED: 'ROLE_ADDED',
}

const Subscription = gql`
  extend type Subscription {
    roleAdded: Role
  }
`

export const subscriptionTypes = () => [Subscription]

export const subscriptionResolvers = {
  Subscription: {
    roleAdded: {
      resolve: (role) => {
        return role
      },
      subscribe: () => pubsub.asyncIterator([subscriptions.ROLE_ADDED]),
    },
  },
}
