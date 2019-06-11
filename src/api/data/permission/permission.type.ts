import { gql } from 'apollo-server-express'

const Permission = gql`
  type Permission {
    id: ID!
    value: String!
  }
`

export const types = () => [Permission]

export const typeResolvers = {}
