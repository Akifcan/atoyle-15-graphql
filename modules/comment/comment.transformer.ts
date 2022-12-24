import { QueryResult } from 'pg'
import { Comment } from './comment.interface'

export const commentToPublicEntity = (record: any): Comment => {
  const { id, employeeid, postid, commentid, date, string, content, ...rest } =
    record

  return {
    id,
    employeeid,
    content,
    postid,
    commentid,
    date,
    employee: { id: employeeid, ...rest }
  }
}

export const commentsToPublicEntity = (rows: QueryResult): Comment[] => {
  return rows.rows.map((comment) => commentToPublicEntity(comment))
}
