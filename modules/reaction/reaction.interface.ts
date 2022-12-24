export interface ReactionType {
  id: number
  name: string
  emoji: string
  createdat: string
}

export interface Reaction {
  id: number
  employeeid: number
  postid?: number
  commentid?: number
  reactionid: number
}
