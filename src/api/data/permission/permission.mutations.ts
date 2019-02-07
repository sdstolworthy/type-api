import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { pubsub } from '../subscriptions'
import { Permission } from './permission.entity'
import { subscriptions } from './permission.subscriptions'

const Mutation = gql``

export const mutationTypes = () => [ Mutation ]

export const mutationResolvers = {
  Mutation: {
  },
}
