'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.userMutations = exports.userQueries = exports.userTypes = void 0
exports.userTypes = `
    type User {
        name: String!,
        lastname: String!
    }

    input UserInput {
        name: String!,
        lastname: String!
    }
`
exports.userQueries = `
    hello: String
    demo: Int
`
exports.userMutations = `
    signIn(user: UserInput): User
`
