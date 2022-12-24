import { User } from '../user/user.interface'

export interface Comment {
  id: number
  employeeid: number
  postid?: number
  commentid?: number
  content: string
  date: string
  employee: User
}

export type CommentInput = Pick<Comment, 'postid' | 'commentid' | 'content'>

export interface CommentPaginateInput {
  id: number
  order: 'desc' | 'asc'
  page: number
}
