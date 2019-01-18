import { gql } from 'apollo-server-express'

const Query = gql`
 extend type Query {
  posts: [Post]
 }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
 Query: {
  posts: () => ([
     {
       title: 'This is the first one',
       body: "Cause if we're talking body",
     },
     {
       title: 'This is the second one',
       body: "You've got a perfect one so put it on me",
     },
   ]),
 },
}
