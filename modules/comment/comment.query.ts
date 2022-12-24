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


`

export const commentQueries = `
    comment(id: ID): Comment
`

export const commentMutations = `
    createComment(comment: CommentInput): Comment
`
