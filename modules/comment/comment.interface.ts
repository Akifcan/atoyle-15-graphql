import { User } from '../user/user.interface'

export interface Comment {
  employeeid: number
  postid?: number
  commentid?: number
  content: string
  date: string
  employee: User
}

export type CommentInput = Pick<Comment, 'postid' | 'commentid' | 'content'>
