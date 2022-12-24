import { QueryResult } from 'pg'
import { Post } from './post.interface'

export const postToPublicEntity = (post: any): Post => {
  const { id, employeeid, content, date, ...rest } = post
  return {
    id,
    employeeid,
    content,
    date,
    employee: { ...rest }
  }
}

export const postsToPublicEntity = (dbRow: QueryResult): Post[] => {
  return dbRow.rows.map((post) => postToPublicEntity(post))
}
