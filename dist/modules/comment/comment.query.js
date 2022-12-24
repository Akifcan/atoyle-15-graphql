"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentMutations = exports.commentQueries = exports.commentTypes = void 0;
exports.commentTypes = `

    type Comment {
        id: ID!,
        employeeid: ID!,
        commentid: ID,
        postid: ID,
        content: String!,
        date: String!,
        employee: User!
    }

    input CommentInput {
        postid: ID,
        commentid: ID,
        content: String!
    }


`;
exports.commentQueries = `
    comment(id: ID): Comment
`;
exports.commentMutations = `
    createComment(comment: CommentInput): Comment
`;
