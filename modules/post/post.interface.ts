export interface Post {
  id: number
  employeeid: number
  content: string
  date: string
}

export type PostInput = Pick<Post, 'content'>
