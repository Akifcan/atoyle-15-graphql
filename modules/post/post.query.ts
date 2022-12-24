export const postTypes = `

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
        userId: Int
    }

    input PostInput {
        content: String!
    }


`

export const postQueries = `
    posts(options: PostListInput): [Post!]!
`

export const postMutations = `
    create(post: PostInput): Post!
`
