import { User } from '../user/user.interface'

export interface ReactionType {
  id: number
  name: string
  emoji: string
  createdat: string
}

export interface ReactionCount {
  count: number
  emoji: string
}

export interface ReactionResult {
  success: boolean
  text: string
}

export interface Reaction {
  id: number
  employeeid: number
  postid?: number
  createdat: string
  commentid?: number
  reactionid: number
  type: ReactionType
  employee: User
}

export type GivePostReactionInput = Required<Pick<Reaction, 'reactionid' | 'postid'>>
export type GiveCommentReactionInput = Required<Pick<Reaction, 'reactionid' | 'commentid'>>
