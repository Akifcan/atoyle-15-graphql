export const userTypes = `

    type User {
        id: ID!,
        name: String!,
        email: String!,
        password: String!,
        isactive: Boolean!,
        createdat: String!
        department: String!
    }

`

export const userQueries = `
    hello: String
    demo: Int
`

export const userMutations = `
    signIn(email: String!, password: String!): User
`
