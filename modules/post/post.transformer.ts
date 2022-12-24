import { QueryResult } from 'pg'
import { Post } from './post.interface'

export const postToPublicEntity = (dbRow: QueryResult): Post[] => {
  return dbRow.rows.map((user) => {
    const { id, employeeid, content, date, ...rest } = user
    return {
      id,
      employeeid,
      content,
      date,
      employee: { ...rest }
    }
  })
}
