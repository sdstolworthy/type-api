import { gql } from 'apollo-server-express'
import * as fs from 'fs'
import { merge } from 'lodash'
import * as path from 'path'
import { logger } from '../../config/logger'

const Query = gql`
  type Query {
    status: String
  }
`

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`

const Subscription = gql`
  type Subscription {
    _empty: String
  }
`

let resolvers = {
  Query: {
    status: () => 'ok',
  },
}

const typeDefs = [Query, Mutation, Subscription]

// Read the current directory and load types and resolvers automatically
// https://medium.com/@xoor/coding-a-graphql-api-with-node-js-c02d617f49f4
fs.readdirSync(__dirname)
  .filter((dir) => dir.indexOf('.') < 0)
  .forEach((dir) => {
    // don't parse these directories
    const ignoredDirs = ['_helpers']
    if (ignoredDirs.indexOf(dir) > -1) {
      return
    }

    logger.debug(`Adding ${dir} to GraphQL`)

    const tmp = require(path.join(__dirname, dir)).default
    resolvers = merge(resolvers, tmp.resolvers)
    typeDefs.push(tmp.types)
  })

export { typeDefs, resolvers }
