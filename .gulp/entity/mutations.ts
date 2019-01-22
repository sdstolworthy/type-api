import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { <%= entityName[0].toUpperCase() + entityName.slice(1) %> } from './<%= entityName %>.entity'

const Mutation = gql`
  extend type Mutation {
    create<%= entityName[0].toUpperCase() + entityName.slice(1) %>(title: String!): <%= entityName[0].toUpperCase() + entityName.slice(1) %>
  }
`

export const mutationTypes = () => [ Mutation ]

export const mutationResolvers = {
  Mutation: {
    async create<%= entityName[0].toUpperCase() + entityName.slice(1) %>(obj, { title }, context, info) {
      return await <%= entityName[0].toUpperCase() + entityName.slice(1) %>.create({ title }).save()
    },
  },
}
