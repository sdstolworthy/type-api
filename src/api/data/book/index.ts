import inputTypes from './book.args'
import { mutationResolvers, mutationTypes } from './book.mutations'
import { queryResolvers, queryTypes } from './book.query'
import { typeResolvers, types } from './book.type'

export default {
 types: () => [types, queryTypes, inputTypes, mutationTypes],
 resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
}
