export const userTypes = `
    type User {
        name: String!,
        lastname: String!
    }

    input UserInput {
        name: String!,
        lastname: String!
    }
`

export const userQueries = `
    hello: String
    demo: Int
`

export const userMutations = `
    signIn(user: UserInput): User
`
