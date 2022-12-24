export const userTypes = `

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

export const userQueries = `
    hello: String
    demo: Int
    profile(slug: String!) : UserProfile 
`

export const userMutations = `
    signIn(email: String!, password: String!): User
`
