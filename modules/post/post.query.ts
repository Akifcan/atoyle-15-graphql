export const postTypes = `

    type Post {
        id: ID!,
        employeeid: ID!,
        content: String!,
        date: String!,
        employee: User!
    }

    input PostInput {
        content: String!
    }


`

export const postQueries = `
    list: [Post!]!
`

export const postMutations = `
    create(post: PostInput): Post!
`
