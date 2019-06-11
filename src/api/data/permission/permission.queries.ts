import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { Permission } from './permission.entity'

const Query = gql`
  extend type Query {
    permission(id: ID!): Permission
    permissions(take: Int, skip: Int): [Permission]
  }
`

export const queryTypes = () => [Query]

export const queryResolvers = {
  Query: {
    async permission(obj, { id }, context, info) {
      return await Permission.findOne({ id })
    },

    async permissions(obj, { take, skip }, context, info) {
      take = take || 10 // default query limit to 10
      if (take > 50) {
        take = 50
      } // limit query to 50 max
      skip = skip || 0 // default to none skipped

      return await Permission.createQueryBuilder('permission')
        .take(take)
        .skip(skip)
        .getMany()
    },
  },
}
