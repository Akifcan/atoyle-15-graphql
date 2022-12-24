import { buildSchema } from 'graphql'
import {
  commentMutations,
  commentQueries,
  commentTypes
} from './comment/comment.query'
import { commentResolvers } from './comment/comment.resolver'
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
  ${commentTypes},
  type Query {
    ${userQueries}
    ${postQueries}
    ${commentQueries}
  }
  type Mutation {
    ${userMutations}
    ${postMutations}
    ${commentMutations}
  }
`)

export const rootValue = {
  ...userResolvers,
  ...postResolvers,
  ...commentResolvers
}
