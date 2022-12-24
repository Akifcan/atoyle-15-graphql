'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.commentResolvers =
  exports.commentTypes =
  exports.commentMutations =
  exports.commentQueries =
    void 0
const comment_query_1 = require('./comment.query')
Object.defineProperty(exports, 'commentQueries', {
  enumerable: true,
  get: function () {
    return comment_query_1.commentQueries
  }
})
Object.defineProperty(exports, 'commentMutations', {
  enumerable: true,
  get: function () {
    return comment_query_1.commentMutations
  }
})
Object.defineProperty(exports, 'commentTypes', {
  enumerable: true,
  get: function () {
    return comment_query_1.commentTypes
  }
})
const comment_resolver_1 = require('./comment.resolver')
Object.defineProperty(exports, 'commentResolvers', {
  enumerable: true,
  get: function () {
    return comment_resolver_1.commentResolvers
  }
})
