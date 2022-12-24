import { format } from 'timeago.js'
import { Reaction } from './reaction.interface'
import { QueryResult } from 'pg'

export const reactionToPublicEntity = (reaction: any): Reaction => {
  const { id, baseid, employeeid, postid, commentid, reactionid, createdat, reactiontypeid, emoji, employeename, reactionname, reactioncreatedat, ...rest } = reaction

  return {
    id: baseid,
    reactionid: reactiontypeid,
    employeeid,
    postid,
    commentid,
    createdat: format(createdat),
    type: {
      id: reactionid,
      name: reactionname,
      emoji,
      createdat: reactioncreatedat
    },
    employee: { ...rest, id: employeeid, name: employeename }
  }
}

export const reactionsToPublicEntity = (dbRow: QueryResult): Reaction[] => {
  return dbRow.rows.map((reaction) => reactionToPublicEntity(reaction))
}
