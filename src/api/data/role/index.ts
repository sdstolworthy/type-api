import inputTypes from './role.args'
import { mutationResolvers, mutationTypes } from './role.mutations'
import { queryResolvers, queryTypes } from './role.queries'
import { subscriptionResolvers, subscriptionTypes } from './role.subscriptions'
import { typeResolvers, types } from './role.type'

export default {
  types: () => [
    types,
    queryTypes,
    inputTypes,
    mutationTypes,
    subscriptionTypes,
  ],
  resolvers: Object.assign(
    queryResolvers,
    mutationResolvers,
    subscriptionResolvers,
    typeResolvers,
  ),
}
