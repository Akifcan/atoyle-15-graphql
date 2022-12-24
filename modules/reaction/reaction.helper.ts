import Db from '../../lib/db/db.postgres'
import { ReturningIdProps } from '../../lib/helpers'
import { ReactionCount, ReactionResult } from './reaction.interface'
import { reactionsToPublicEntity } from './reaction.transformer'

export const handleReactions = async (employeeId: number, reactionId: number, columnName: 'postid' | 'commentid', id: number): Promise<ReactionResult> => {
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

export const handleReactionCount = async (id: number, columnName: 'postid' | 'commentid'): Promise<ReactionCount[]> => {
  const query = await Db.client.query(
    `
        SELECT COUNT(reaction_types.emoji), reaction_types.emoji FROM reaction
        INNER JOIN reaction_types
        ON 
        reaction.reactionid = reaction_types.id
        WHERE reaction.${columnName} = $1
        GROUP BY reaction_types.emoji
    `,
    [id]
  )

  return query.rows
}

export const handleReactedUsers = async (id: number, columnName: 'postid' | 'commentid', reactionId?: number): Promise<any> => {
  const reaction = await Db.client.query(
    `
    SELECT  employee.id as employeeid, reaction_types.id as reactiontypeid, employee.name as employeename, reaction_types.name as reactionname, 
    reaction_types.createdat as reactioncreatedat,
    * FROM reaction 
    INNER JOIN employee
    ON reaction.employeeid = employee.id
    INNER JOIN reaction_types
    ON reaction.reactionid = reaction_types.id
    WHERE reaction.${columnName} = $1
  `,
    [id]
  )

  return reactionsToPublicEntity(reaction)
}
