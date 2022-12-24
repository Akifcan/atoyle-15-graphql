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

    type Reaction {
        id: ID!,
        employeeid: ID!,
        reactionid: ID!
        postid: ID,
        commentid: ID
        employee: User!
        type: ReactionType!
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
   showCommentReactions(id: ID!): [ReactionCount!]!
   showPostReactedUsers(id: ID!): [Reaction!]!
   showCommentReactedUsers(id: ID!): [Reaction!]!
`

export const reactionMutations = `
    givePostReaction(reaction: GivePostReactionInput): ReactionResult
    giveCommentReaction(reaction: GiveCommentReactionInput): ReactionResult
`
