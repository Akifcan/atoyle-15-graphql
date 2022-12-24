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
  reactionMutations,
  reactionQueries,
  reactionTypes
} from './reaction/reaction.query'
import { reactionResolvers } from './reaction/reaction.resolver'
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
  ${reactionTypes}
  type Query {
    ${userQueries}
    ${postQueries}
    ${commentQueries}
    ${reactionQueries}
  }
  type Mutation {
    ${userMutations}
    ${postMutations}
    ${commentMutations}
    ${reactionMutations}
  }
`)

export const rootValue = {
  ...userResolvers,
  ...postResolvers,
  ...commentResolvers,
  ...reactionResolvers
}
