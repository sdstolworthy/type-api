import { gql } from 'apollo-server-express'

const Role = gql`
  type Role {
    id: ID!
    name: String!
  }
`

export const types = () => [Role]

export const typeResolvers = {}
