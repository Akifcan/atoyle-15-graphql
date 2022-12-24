import { QueryResult } from 'pg'
import { Comment } from './comment.interface'
import { format } from 'timeago.js'

export const commentToPublicEntity = (record: any): Comment => {
  const { id, baseid, employeeid, postid, commentid, date, string, content, commentcontent, ...rest } = record

  return {
    id: baseid,
    employeeid,
    content: commentcontent,
    postid,
    commentid,
    date: format(date),
    employee: { id: employeeid, ...rest }
  }
}

export const commentsToPublicEntity = (rows: QueryResult): Comment[] => {
  return rows.rows.map((comment) => commentToPublicEntity(comment))
}
