'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.rootValue = exports.schema = void 0
const graphql_1 = require('graphql')
const comment_query_1 = require('./comment/comment.query')
const comment_resolver_1 = require('./comment/comment.resolver')
const post_query_1 = require('./post/post.query')
const post_resolver_1 = require('./post/post.resolver')
const user_module_1 = require('./user/user.module')
exports.schema = (0, graphql_1.buildSchema)(`
  ${user_module_1.userTypes}
  ${post_query_1.postTypes},
  ${comment_query_1.commentTypes},
  type Query {
    ${user_module_1.userQueries}
    ${post_query_1.postQueries}
    ${comment_query_1.commentQueries}
  }
  type Mutation {
    ${user_module_1.userMutations}
    ${post_query_1.postMutations}
    ${comment_query_1.commentMutations}
  }
`)
exports.rootValue = Object.assign(
  Object.assign(
    Object.assign({}, user_module_1.userResolvers),
    post_resolver_1.postResolvers
  ),
  comment_resolver_1.commentResolvers
)
