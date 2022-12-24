"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutations = exports.userQueries = exports.userTypes = void 0;
exports.userTypes = `

    type User {
        id: ID!,
        name: String!,
        email: String!,
        password: String!,
        isactive: Boolean!,
        createdat: String!
        department: String!
    }

`;
exports.userQueries = `
    hello: String
    demo: Int
`;
exports.userMutations = `
    signIn(email: String!, password: String!): User
`;
