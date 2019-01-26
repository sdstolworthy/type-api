import inputTypes from './post.args'
import { mutationResolvers, mutationTypes } from './post.mutations'
import { queryResolvers, queryTypes } from './post.query'
import { subscriptionResolvers, subscriptionTypes } from './post.subscriptions'
import { typeResolvers, types } from './post.type'

export default {
  types: () => [types, queryTypes, inputTypes, mutationTypes, subscriptionTypes],
  resolvers: Object.assign(queryResolvers, mutationResolvers, subscriptionResolvers, typeResolvers),
}
