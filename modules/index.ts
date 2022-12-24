import { buildSchema } from 'graphql'
import { postMutations, postQueries, postTypes } from './post/post.query'
import { postResolvers } from './post/post.resolver'
import {
  userMutations,
  userQueries,
  userResolvers,
  userTypes
} from './user/user.module'

export const schema = buildSchema(`
  ${userTypes}
  ${postTypes},
  type Query {
    ${userQueries}
    ${postQueries}
  }
  type Mutation {
    ${userMutations}
    ${postMutations}
  }
`)

export const rootValue = {
  ...userResolvers,
  ...postResolvers
}
