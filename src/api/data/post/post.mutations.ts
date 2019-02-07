import { gql } from 'apollo-server-express'
import { pubsub } from '../subscriptions'
import { Post } from './post.entity'
import { subscriptions } from './post.subscriptions'

const Mutation = gql`
  extend type Mutation {
    createPost(title: String!, body: String): Post
  }
`

export const mutationTypes = () => [ Mutation ]

export const mutationResolvers = {
  Mutation: {
    async createPost(obj, { title, body }, context, info) {
      const post = await Post.create({ title, body })
        .save()

      pubsub.publish(subscriptions.POST_ADDED, post)
      return post
    },
  },
}
