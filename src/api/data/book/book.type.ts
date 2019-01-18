import { gql } from 'apollo-server-express'

const Book = gql`
 type Book {
   title: String!
   author: String!
 }
`

export const types = () => [ Book ]

export const typeResolvers = {

}
