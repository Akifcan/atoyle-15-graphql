'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.commentMutations =
  exports.commentQueries =
  exports.commentTypes =
    void 0
exports.commentTypes = `

    type Comment {
        id: ID!,
        employeeid: ID!,
        content: String!,
        date: String!
    }

`
exports.commentQueries = `
    hellocomment: String
`
exports.commentMutations = `
    comment: String
`
