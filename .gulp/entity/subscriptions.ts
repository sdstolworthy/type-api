import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { pubsub } from '../subscriptions'

export const subscriptions = {
  <%= entityName.toUpperCase() %>_ADDED: '<%= entityName.toUpperCase() %>_ADDED',
}

const Subscription = gql`
  extend type Subscription {
    <%= entityName %>Added: <%= entityName[0].toUpperCase() + entityName.slice(1) %>
  }
`

export const subscriptionTypes = () => [ Subscription ]

export const subscriptionResolvers = {
  Subscription: {
    <%= entityName %>Added: {
      resolve: (<%= entityName %>) => {
        return <%= entityName %>
      },
      subscribe: () => pubsub.asyncIterator([subscriptions.<%= entityName.toUpperCase() %>_ADDED]),
    },
  },
}
