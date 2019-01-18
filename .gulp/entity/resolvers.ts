import { getRepository } from 'typeorm'
import { <%= entityName[0].toUpperCase() + entityName.slice(1) %> } from './<%= entityName %>.entity'

export const <%= entityName %>Resolvers = {
  async <%= entityName %>(obj, { id }, context, info) {
    const repository = getRepository(<%= entityName[0].toUpperCase() + entityName.slice(1) %>)
    return await repository.findOne({ id })
  },

  async <%= entityName %>s() {
    const repository = getRepository(<%= entityName[0].toUpperCase() + entityName.slice(1) %>)
    return await repository.find()
  },
}
