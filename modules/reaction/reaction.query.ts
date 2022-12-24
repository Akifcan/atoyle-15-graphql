export const reactionTypes = `

    type ReactionType {
        id: ID!,
        name: String!,
        emoji: String!,
        createdat: String!
    }

    type ReactionResult {
        success: Boolean!,
        text: String!
    }

    input Reaction {
        id: ID!,
        employeeid: ID!,
        reactionid: ID!
        postid: ID,
        commentid: ID
    }

    input GivePostReactionInput {
        reactionid: ID!,
        postid: ID!,
    }

    input GiveCommentReactionInput {
        reactionid: ID!,
        commentid: ID!,
    }


`

export const reactionQueries = `
   showReactions: String
`

export const reactionMutations = `
    givePostReaction(reaction: GivePostReactionInput): ReactionResult
    giveCommentReaction(reaction: GiveCommentReactionInput): ReactionResult
`
