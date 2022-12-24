'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.userMutations = exports.userQueries = exports.userTypes = void 0
exports.userTypes = `

    type User {
        id: ID!,
        name: String!,
        email: String!,
        password: String!,
        isactive: Boolean!,
        createdat: String!
        department: String!,
        token: String!,
        description: String,
        slug: String!
    }

    type UserProfile {
        id: ID!,
        name: String!,
        email: String!,
        department: String!,
        description: String,
        slug: String!
    }

`
exports.userQueries = `
    profile(slug: String!) : UserProfile 
`
exports.userMutations = `
    signIn(email: String!, password: String!): User
`
