import { User } from '../user/user.interface'

export interface Post {
  id: number
  employeeid: number
  content: string
  date: string
  employee: User
}

export type PostInput = Pick<Post, 'content'>

export interface PostListProps {
  page: number
  userId?: number
  department?: string
  order: 'desc' | 'asc' = 'desc'
}
