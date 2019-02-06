import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { pubsub } from '../subscriptions'
import { Role } from './role.entity'
import { subscriptions } from './role.subscriptions'

const Mutation = gql`
  extend type Mutation {
    createRole(name: String!): Role
  }
`

export const mutationTypes = () => [ Mutation ]

export const mutationResolvers = {
  Mutation: {
    async createRole(obj, { name }, context, info) {
      const role = await Role.create({ name }).save()
      pubsub.publish(subscriptions.ROLE_ADDED, role)
      return role
    },
  },
}
