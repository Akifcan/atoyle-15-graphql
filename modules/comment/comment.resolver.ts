import { authGuard, ContextProps, ReturningIdProps } from '../../lib/helpers'
import { Comment, CommentInput } from './comment.interface'
import * as yup from 'yup'
import Db from '../../lib/db/db.postgres'
import { commentToPublicEntity } from './comment.transformer'

export const commentResolvers = {
  comment: async (
    props: { id: number },
    context: ContextProps
  ): Promise<Comment> => {
    const { id } = props

    authGuard(context.headers.authorization)
    const comment = await Db.client.query(
      'SELECT * FROM comment INNER JOIN employee ON comment.employeeid = employee.id WHERE comment.id = $1',
      [id]
    )

    if (comment.rows.length === 0) {
      throw new Error('This comment not found')
    }

    return commentToPublicEntity(comment.rows[0])
  },

  createComment: async (
    props: { comment: CommentInput },
    context: ContextProps
  ): Promise<Comment> => {
    const {
      comment: { postid, commentid, content }
    } = props

    const currentUser = authGuard(context.headers.authorization)

    if (postid !== undefined && commentid !== undefined) {
      throw new Error(
        'You can only create comment for post or comment not both'
      )
    }

    const schema = yup.object().shape({
      content: yup.string().required().max(280)
    })

    schema.validateSync({ content })

    const query = await Db.client.query(
      `
        INSERT INTO comment (employeeid, postid, commentid, content) VALUES ($1, $2, $3, $4) RETURNING id;
      `,
      [currentUser.id, postid, commentid, content]
    )

    const { id } = query.rows[0] as ReturningIdProps

    const comment = await Db.client.query(
      'SELECT * FROM comment INNER JOIN employee ON comment.employeeid = employee.id WHERE comment.id = $1',
      [id]
    )

    return commentToPublicEntity(comment.rows[0])
  }
}
