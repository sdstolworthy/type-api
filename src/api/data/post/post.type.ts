import { gql } from 'apollo-server-express'

const Post = gql`
 type Post {
   id: ID!
   title: String!
   body: String!
 }
`

export const types = () => [ Post ]

export const typeResolvers = {

}
