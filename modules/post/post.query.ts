export const postTypes = `

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

export const postQueries = `
    hello: String
`

export const postMutations = `
    create(post: PostInput): Post!
`
