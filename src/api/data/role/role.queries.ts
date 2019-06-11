import { gql } from 'apollo-server-express'
import { needsPermission, PermissionValues } from '../_helpers/authorization'
import { Role } from './role.entity'

const Query = gql`
  extend type Query {
    role(id: ID!): Role
    roles(take: Int, skip: Int): [Role]
  }
`

export const queryTypes = () => [Query]

export const queryResolvers = {
  Query: {
    async role(obj, { id }, context, info) {
      await needsPermission(context.user, PermissionValues.CAN_READ_ROLE)
      return await Role.findOne({ id })
    },

    async roles(obj, { take, skip }, context, info) {
      take = take || 10 // default query limit to 10
      if (take > 50) {
        take = 50
      } // limit query to 50 max
      skip = skip || 0 // default to none skipped

      await needsPermission(context.user, PermissionValues.CAN_READ_ROLE)
      return await Role.createQueryBuilder('role')
        .take(take)
        .skip(skip)
        .getMany()
    },
  },
}
