import inputTypes from './yolo.args'
import { mutationResolvers, mutationTypes } from './yolo.mutations'
import { queryResolvers, queryTypes } from './yolo.query'
import { typeResolvers, types } from './yolo.type'

export default {
 types: () => [types, queryTypes, inputTypes, mutationTypes],
 resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
}
