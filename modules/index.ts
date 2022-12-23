import { buildSchema } from 'graphql'
import {
  userMutations,
  userQueries,
  userResolvers,
  userTypes
} from './user/user.module'

export const schema = buildSchema(`
  ${userTypes}
  type Query {
    ${userQueries}
  }
  type Mutation {
    ${userMutations}
  }
`)

export const rootValue = {
  ...userResolvers
}
