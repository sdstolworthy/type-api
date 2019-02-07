import { queryResolvers, queryTypes } from './permission.queries'
import { typeResolvers, types } from './permission.type'

export default {
  types: () => [types, queryTypes],
  resolvers: Object.assign(queryResolvers, typeResolvers),
}
