import { getRepository } from 'typeorm'
import { Post } from './post.entity'

export const postResolvers = {
  async post(obj, { id }, context, info) {
    const repository = getRepository(Post)
    return await repository.findOne({ id })
  },

  async posts() {
    const repository = getRepository(Post)
    return await repository.find()
  },
}
