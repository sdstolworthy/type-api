import inputTypes from './user.args'
import { mutationResolvers, mutationTypes } from './user.mutations'
import { queryResolvers, queryTypes } from './user.queries'
import { typeResolvers, types } from './user.type'

export default {
  types: () => [types, queryTypes, inputTypes, mutationTypes],
  resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
}
