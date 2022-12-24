export const commentTypes = `

    type Comment {
        id: ID!,
        employeeid: ID!,
        commentid: ID,
        postid: ID,
        content: String!,
        date: String!
    }

    input CommentInput {
        postid: ID,
        commentid: ID,
        content: String!
    }


`

export const commentQueries = `
    hellocomment: String
`

export const commentMutations = `
    createComment(comment: CommentInput): String
`
