import inputTypes from './<%= entityName %>.args'
import { mutationResolvers, mutationTypes } from './<%= entityName %>.mutations'
import { queryResolvers, queryTypes } from './<%= entityName %>.query'
import { typeResolvers, types } from './<%= entityName %>.type'

export default {
  types: () => [types, queryTypes, inputTypes, mutationTypes],
  resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
}
