import { gql } from 'apollo-server-express'
import { logger } from '../../../config/logger'
import { Post } from './post.entity'

const Mutation = gql`
  extend type Mutation {
    createPost(title: String!, body: String): Post
  }
`

export const mutationTypes = () => [ Mutation ]

export const mutationResolvers = {
  Mutation: {
    async createPost(obj, { title, body }, context, info) {
      return await Post.create({ title, body }).save()
    },
  },
}
