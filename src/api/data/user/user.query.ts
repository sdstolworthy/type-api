import { gql } from 'apollo-server-express'

const Query = gql`
 extend type Query {
   users: [User]
 }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
 Query: {
   users: () => ([
     {
       id: 'abc123',
       email: 'jacob@gmail.com',
     },
     {
       id: 'Jurassic Park',
       email: 'Michael Crichton',
     },
   ]),
 },
}
