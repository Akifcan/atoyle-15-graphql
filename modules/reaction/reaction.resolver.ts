import Db from '../../lib/db/db.postgres'
import { authGuard, ContextProps, ReturningIdProps } from '../../lib/helpers'
import { GiveCommentReactionInput, GivePostReactionInput, ReactionResult } from './reaction.interface'

const handleReactions = async (employeeId: number, reactionId: number, columnName: 'postid' | 'commentid', id: number): Promise<ReactionResult> => {
  const response = await Db.client.query(`SELECT * FROM reaction WHERE employeeid = $1 AND ${columnName} = $2`, [employeeId, id])

  if (response.rows.length > 0) {
    const { id } = response.rows[0] as ReturningIdProps

    await Db.client.query('DELETE FROM reaction WHERE id = $1', [id])

    return {
      success: true,
      text: `You reaction has been revoked from this ${columnName.replace('id', '')} `
    }
  } else {
    await Db.client.query(`INSERT INTO reaction (employeeid, ${columnName}, reactionid) VALUES ($1, $2, $3)`, [employeeId, id, reactionId])

    return {
      success: true,
      text: `You just reacted this ${columnName.replace('id', '')}`
    }
  }
}

export const reactionResolvers = {
  showReactions: async (props: any, context: ContextProps): Promise<String> => {
    authGuard(context.headers.authorization)
    return 'ok'
  },
  givePostReaction: async (props: { reaction: GivePostReactionInput }, context: ContextProps): Promise<ReactionResult> => {
    const employee = authGuard(context.headers.authorization)
    const {
      reaction: { postid, reactionid }
    } = props

    return await handleReactions(employee.id, reactionid, 'postid', postid)
  },

  giveCommentReaction: async (props: { reaction: GiveCommentReactionInput }, context: ContextProps): Promise<ReactionResult> => {
    const employee = authGuard(context.headers.authorization)
    const {
      reaction: { commentid, reactionid }
    } = props

    return await handleReactions(employee.id, reactionid, 'commentid', commentid)
  }
}
