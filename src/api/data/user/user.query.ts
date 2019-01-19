import { gql } from 'apollo-server-express'
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
      return await User.findOne({ id })
    },

    async users() {
      return await User.find()
    },
  },
}
