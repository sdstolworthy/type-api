import { gql } from 'apollo-server-express'
import { Post } from './post.entity'

const Query = gql`
  extend type Query {
    post(id: ID!): Post
    posts: [Post]
  }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
  Query: {
    async post(obj, { id }, context, info) {
      return await Post.findOne({ id })
    },

    async posts() {
      return await Post.find()
    },
  },
}
