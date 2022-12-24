export const commentTypes = `

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

    input CommentPaginateInput {
        id: ID!,
        page: Int!,
        order: String = "DESC"
    }

`

export const commentQueries = `
    comment(id: ID!): Comment!,
    commentReplies(options: CommentPaginateInput!): [Comment!]!,
    postComments(options: CommentPaginateInput!): [Comment!]!
`

export const commentMutations = `
    createComment(comment: CommentInput): Comment
`
