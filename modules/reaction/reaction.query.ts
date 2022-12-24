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

    type ReactionCount {
        count: Int!,
        emoji: String!
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
   showPostReactions(id: ID!): [ReactionCount!]!
`

export const reactionMutations = `
    givePostReaction(reaction: GivePostReactionInput): ReactionResult
    giveCommentReaction(reaction: GiveCommentReactionInput): ReactionResult
`
