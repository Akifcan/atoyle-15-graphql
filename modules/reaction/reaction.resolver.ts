import { authGuard, ContextProps } from '../../lib/helpers'
import { handleReactionCount, handleReactions } from './reaction.helper'
import { GiveCommentReactionInput, GivePostReactionInput, ReactionCount, ReactionResult } from './reaction.interface'

export const reactionResolvers = {
  showPostReactions: async (props: { id: number }, context: ContextProps): Promise<ReactionCount[]> => {
    authGuard(context.headers.authorization)
    const { id } = props
    return await handleReactionCount(id, 'postid')
  },
  showCommentReactions: async (props: { id: number }, context: ContextProps): Promise<ReactionCount[]> => {
    authGuard(context.headers.authorization)
    const { id } = props
    return await handleReactionCount(id, 'commentid')
  },
  givePostReaction: async (props: { reaction: GivePostReactionInput }, context: ContextProps): Promise<ReactionResult> => {
    const employee = authGuard(context.headers.authorization)
    const {
      reaction: { postid, reactionid }
    } = props

    return await handleReactions(employee.id, reactionid, 'postid', postid)
  },

  giveCommentReaction: async (props: { reaction: GiveCommentReactionInput }, context: ContextProps): Promise<ReactionResult> => {
    const employee = authGuard(context.headers.authorization)
    const {
      reaction: { commentid, reactionid }
    } = props

    return await handleReactions(employee.id, reactionid, 'commentid', commentid)
  }
}
