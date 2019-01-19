import { gql } from 'apollo-server-express'
import { <%= entityName[0].toUpperCase() + entityName.slice(1) %> } from './<%= entityName %>.entity'

const Query = gql`
  extend type Query {
    <%= entityName %>(id: ID!): <%= entityName[0].toUpperCase() + entityName.slice(1) %>
    <%= entityName %>s: [<%= entityName[0].toUpperCase() + entityName.slice(1) %>]
  }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
  Query: {
    async <%= entityName %>(obj, { id }, context, info) {
      return await <%= entityName[0].toUpperCase() + entityName.slice(1) %>.findOne({ id })
    },

    async <%= entityName %>s() {
      return await <%= entityName[0].toUpperCase() + entityName.slice(1) %>.find()
    },
  },
}
