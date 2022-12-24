'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.postMutations = exports.postQueries = exports.postTypes = void 0
exports.postTypes = `

    type Post {
        id: ID!,
        employeeid: ID!,
        content: String!,
        date: String!,
        employee: User!
    }

    input PostListInput {
        page: Int!,
        department: String,
        userId: Int,
        order: String = "desc"
    }

    input PostInput {
        content: String!
    }


`
exports.postQueries = `
    posts(options: PostListInput): [Post!]!
`
exports.postMutations = `
    create(post: PostInput): Post!
`
