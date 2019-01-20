import inputTypes from './post.args'
import { mutationResolvers, mutationTypes } from './post.mutations'
import { queryResolvers, queryTypes } from './post.query'
import { typeResolvers, types } from './post.type'

export default {
  types: () => [types, queryTypes, inputTypes, mutationTypes],
  resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
}
