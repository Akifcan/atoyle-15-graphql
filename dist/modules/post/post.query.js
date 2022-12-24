"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMutations = exports.postQueries = exports.postTypes = void 0;
exports.postTypes = `

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


`;
exports.postQueries = `
    list: [Post!]!
`;
exports.postMutations = `
    create(post: PostInput): Post!
`;
