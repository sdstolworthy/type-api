/**
 * Apollo Server doesn't need additional configuration to set up subscriptions.
 * https://www.apollographql.com/docs/apollo-server/features/subscriptions.html
 */
import { PubSub } from 'apollo-server-express'

export const pubsub = new PubSub()
