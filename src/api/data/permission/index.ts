import inputTypes from './permission.args'
import { mutationResolvers, mutationTypes } from './permission.mutations'
import { queryResolvers, queryTypes } from './permission.queries'
import { subscriptionResolvers, subscriptionTypes } from './permission.subscriptions'
import { typeResolvers, types } from './permission.type'

export default {
  types: () => [types, queryTypes, inputTypes, subscriptionTypes],
  resolvers: Object.assign(queryResolvers, subscriptionResolvers, typeResolvers),
}
