import { gql } from 'apollo-server-express'

const Query = gql`
 extend type Query {
  <%= entityName %>(id: ID!): <%= entityName[0].toUpperCase() + entityName.slice(1) %>
  <%= entityName %>s: [<%= entityName[0].toUpperCase() + entityName.slice(1) %>]
 }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
 Query: {
  <%= entityName %>s: () => ([
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
