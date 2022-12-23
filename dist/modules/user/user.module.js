'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.userTypes =
  exports.userResolvers =
  exports.userMutations =
  exports.userQueries =
    void 0
const user_query_1 = require('./user.query')
Object.defineProperty(exports, 'userQueries', {
  enumerable: true,
  get: function () {
    return user_query_1.userQueries
  }
})
Object.defineProperty(exports, 'userMutations', {
  enumerable: true,
  get: function () {
    return user_query_1.userMutations
  }
})
Object.defineProperty(exports, 'userTypes', {
  enumerable: true,
  get: function () {
    return user_query_1.userTypes
  }
})
const user_resolver_1 = require('./user.resolver')
Object.defineProperty(exports, 'userResolvers', {
  enumerable: true,
  get: function () {
    return user_resolver_1.userResolvers
  }
})
