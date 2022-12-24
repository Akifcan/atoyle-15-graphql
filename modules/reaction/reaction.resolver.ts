/* eslint-disable @typescript-eslint/member-delimiter-style */
import { authGuard, ContextProps } from '../../lib/helpers'
import { handleReactedUsers, handleReactionCount, handleReactions } from './reaction.helper'
import { GiveCommentReactionInput, GivePostReactionInput, Reaction, ReactionCount, ReactionResult } from './reaction.interface'

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
  },
  showPostReactedUsers: async (props: { id: number; reactionId?: number }, context: ContextProps): Promise<Reaction[]> => {
    authGuard(context.headers.authorization)
    const { id, reactionId } = props
    return await handleReactedUsers(id, 'postid', reactionId)
  },
  showCommentReactedUsers: async (props: { id: number; reactionId: number }, context: ContextProps): Promise<Reaction[]> => {
    authGuard(context.headers.authorization)
    const { id, reactionId } = props
    return await handleReactedUsers(id, 'commentid', reactionId)
  }
}
