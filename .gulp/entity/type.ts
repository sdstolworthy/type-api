import { gql } from 'apollo-server-express'

const <%= entityName[0].toUpperCase() + entityName.slice(1) %> = gql`
  type <%= entityName[0].toUpperCase() + entityName.slice(1) %> {
    id: ID!
    title: String!
    body: String
  }
`

export const types = () => [ <%= entityName[0].toUpperCase() + entityName.slice(1) %> ]

export const typeResolvers = {

}
