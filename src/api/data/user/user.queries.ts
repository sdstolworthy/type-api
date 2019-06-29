import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { User } from './user.entity'

const Query = gql`
  extend type Query {
    user(id: ID!): User

    users(take: Int, skip: Int): [User]
  }
`

export const queryTypes = () => [Query]

export const queryResolvers = {
  Query: {
    async user(obj, { id }, context, info) {
      return await User.findOne({ id })
    },

    async users(obj, { take, skip }, context, info) {
      take = take || 10 // default query limit to 10
      if (take > 50) {
        take = 50
      } // limit query to 50 max
      skip = skip || 0 // default to none skipped

      return await User.createQueryBuilder('user')
        .take(take)
        .skip(skip)
        .getMany()
    },
  },
}
