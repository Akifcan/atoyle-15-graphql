'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.postMutations = exports.postQueries = exports.postTypes = void 0
exports.postTypes = `

    type Post {
        id: ID!,
        employeeid: ID!,
        content: String!,
        date: String!
    }

    input PostInput {
        content: String!
    }


`
exports.postQueries = `
    hello: String
`
exports.postMutations = `
    create: String
`
