import { gql } from 'apollo-server-express'
import { getRepository } from 'typeorm'
import { User } from './user.entity'

const Query = gql`
  extend type Query {
    user(id: ID!): User
    users: [User]
  }
`

export const queryTypes = () => [Query]

export const queryResolvers = {
  Query: {
    async user(obj, { id }, context, info) {
      const repository = getRepository(User)
      return await repository.findOne({ id })
    },

    async users() {
      const repository = getRepository(User)
      return await repository.find()
    },
  },
}
