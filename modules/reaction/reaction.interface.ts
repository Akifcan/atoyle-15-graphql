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
  commentid?: number
  reactionid: number
  type: ReactionType
}

export type GivePostReactionInput = Required<Pick<Reaction, 'reactionid' | 'postid'>>
export type GiveCommentReactionInput = Required<Pick<Reaction, 'reactionid' | 'commentid'>>
