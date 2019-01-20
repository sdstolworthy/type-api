import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { <%= entityName[0].toUpperCase() + entityName.slice(1) %> } from './<%= entityName %>.entity'

const Query = gql`
  extend type Query {
    <%= entityName %>(id: ID!): <%= entityName[0].toUpperCase() + entityName.slice(1) %>
    <%= entityName %>s(
      take: Int,
      skip: Int,
    ): [<%= entityName[0].toUpperCase() + entityName.slice(1) %>]
  }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
  Query: {
    async <%= entityName %>(obj, { id }, context, info) {
      return await <%= entityName[0].toUpperCase() + entityName.slice(1) %>.findOne({ id })
    },

    async <%= entityName %>s(obj, { take, skip }, context, info) {
      take = take || 10 // default query limit to 10
      if (take > 50) { take = 50 } // limit query to 50 max
      skip = skip || 0 // default to none skipped

      return await <%= entityName[0].toUpperCase() + entityName.slice(1) %>.createQueryBuilder('<%= entityName =>')
        .take(take)
        .skip(skip)
        .getMany()
    },
  },
}
