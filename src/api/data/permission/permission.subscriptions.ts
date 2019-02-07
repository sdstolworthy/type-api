import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { pubsub } from '../subscriptions'

export const subscriptions = {
  PERMISSION_ADDED: 'PERMISSION_ADDED',
}

const Subscription = gql`
  extend type Subscription {
    permissionAdded: Permission
  }
`

export const subscriptionTypes = () => [ Subscription ]

export const subscriptionResolvers = {
  Subscription: {
    permissionAdded: {
      resolve: (permission) => {
        return permission
      },
      subscribe: () => pubsub.asyncIterator([subscriptions.PERMISSION_ADDED]),
    },
  },
}
