export const reactionTypes = `

    type ReactionType {
        id: ID!,
        name: String!,
        emoji: String!,
        createdat: String!
    }

    input Reaction {
        id: ID!,
        employeeid: ID!,
        reactionid: ID!
        postid: ID,
        commentid: ID
    }

    input GiveReactionInput {
        reactionid: ID!,
        postid: ID,
        commentid: ID
    }


`

export const reactionQueries = `
   showReactions: String
`

export const reactionMutations = `
    giveReaction: String
`
