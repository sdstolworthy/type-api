import { getRepository } from 'typeorm'
import { User } from './user.entity'

export const userResolvers = {
  async user(obj, { id }, context, info) {
    const repository = getRepository(User)
    return await repository.findOne({ id })
  },

  async users() {
    const repository = getRepository(User)
    return await repository.find()
  },
}
