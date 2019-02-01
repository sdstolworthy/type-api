import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { Post } from './post.entity'

const Query = gql`
  extend type Query {
    post(id: ID!): Post
    posts(
      take: Int,
      skip: Int,
    ): [Post]
  }
`

export const queryTypes = () => [ Query ]

export const queryResolvers = {
  Query: {
    async post(obj, { id }, context, info) {
      return await Post.findOne({ id })
    },

    async posts(obj, { take, skip }, context, info) {
      take = take || 10 // default query limit to 10
      if (take > 50) { take = 50 } // limit query to 50 max
      skip = skip || 0 // default to none skipped

      return await Post.createQueryBuilder('post')
        .take(take)
        .skip(skip)
        .getMany()
    },
  },
}
