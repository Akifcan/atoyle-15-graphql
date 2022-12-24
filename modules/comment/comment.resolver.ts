import { authGuard, ContextProps, RESULTS_PER_PAGE, ReturningIdProps } from '../../lib/helpers'
import { Comment, CommentInput, CommentPaginate } from './comment.interface'
import * as yup from 'yup'
import Db from '../../lib/db/db.postgres'
import { commentToPublicEntity, commentsToPublicEntity } from './comment.transformer'

export const commentResolvers = {
  commentReplies: async (props: { id: number }, context: ContextProps): Promise<Comment[]> => {
    authGuard(context.headers.authorization)

    const { id } = props

    const comments = await Db.client.query(
      `
        SELECT comment.content as commentcontent, comment.id as baseid, * FROM comment
        INNER JOIN employee ON comment.employeeid = employee.id
        where comment.commentid = $1
    `,
      [id]
    )

    return commentsToPublicEntity(comments)
  },

  postComments: async (props: { options: CommentPaginate }, context: ContextProps): Promise<Comment[]> => {
    authGuard(context.headers.authorization)
    const {
      options: { id, page, order }
    } = props

    const currentPage = (page - 1) * RESULTS_PER_PAGE

    const comment = await Db.client.query(
      `
        SELECT comment.id as baseid, comment.content as commentcontent, * FROM comment 
        INNER JOIN post ON comment.postid = post.id 
        INNER JOIN employee ON comment.employeeid = employee.id 
        WHERE post.id = $1
        ORDER BY comment.date ${order}
        LIMIT $2 OFFSET $3;
      `,
      [id, RESULTS_PER_PAGE, currentPage]
    )

    if (comment.rows.length === 0) {
      throw new Error('This comment not found')
    }

    return commentsToPublicEntity(comment)
  },

  comment: async (props: { id: number }, context: ContextProps): Promise<Comment> => {
    authGuard(context.headers.authorization)

    const { id } = props

    const comment = await Db.client.query(
      'SELECT comment.content as commentcontent, comment.id as baseid, * FROM comment INNER JOIN employee ON comment.employeeid = employee.id WHERE comment.id = $1',
      [id]
    )

    if (comment.rows.length === 0) {
      throw new Error('This comment not found')
    }

    return commentToPublicEntity(comment.rows[0])
  },

  createComment: async (props: { comment: CommentInput }, context: ContextProps): Promise<Comment> => {
    const currentUser = authGuard(context.headers.authorization)

    const {
      comment: { postid, commentid, content }
    } = props

    if (postid !== undefined && commentid !== undefined) {
      throw new Error('You can only create comment for post or comment not both')
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
      'SELECT comment.content as commentcontent, comment.id as baseid, * FROM comment INNER JOIN employee ON comment.employeeid = employee.id WHERE comment.id = $1',
      [id]
    )

    return commentToPublicEntity(comment.rows[0])
  }
}
