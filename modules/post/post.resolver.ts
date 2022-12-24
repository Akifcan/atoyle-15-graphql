import { authGuard, ContextProps, RESULTS_PER_PAGE, ReturningIdProps } from '../../lib/helpers'
import * as yup from 'yup'
import { Post, PostInput, PostListProps } from './post.interface'
import Db from '../../lib/db/db.postgres'
import { postToPublicEntity, postsToPublicEntity } from './post.transformer'

export const postResolvers = {
  post: async (props: { id: number }, context: ContextProps): Promise<Post> => {
    authGuard(context.headers.authorization)
    const { id } = props

    const post = await Db.client.query(
      `
      SELECT * FROM post INNER JOIN employee ON post.employeeid = employee.id
      WHERE post.id = $1
    `,
      [id]
    )

    if (post.rows.length === 0) {
      throw new Error('No post found!')
    }

    return postToPublicEntity(post.rows[0])
  },

  posts: async (props: { options: PostListProps }, context: ContextProps): Promise<Post[]> => {
    try {
      authGuard(context.headers.authorization)

      const {
        options: { department, page, userId, order }
      } = props

      const currentPage = (page - 1) * RESULTS_PER_PAGE

      let filterByDepartmentQuery = ''
      let filterByUserQuery = ''

      if (department !== undefined && department !== null && department.length > 0) {
        filterByDepartmentQuery = `WHERE employee.department = '${department}'`
      }

      if (userId !== undefined && userId !== null) {
        filterByUserQuery = `${filterByDepartmentQuery !== undefined ? 'AND' : 'WHERE'}  employee.id = ${userId}`
      }

      const query = await Db.client.query(
        `
        SELECT * FROM post INNER JOIN employee ON post.employeeid = employee.id 
        ${filterByDepartmentQuery}
        ${filterByUserQuery}
        ORDER BY date ${order}
        LIMIT $1 OFFSET $2;
      `,
        [RESULTS_PER_PAGE, currentPage]
      )

      const posts = postsToPublicEntity(query)

      if (posts.length === 0) {
        throw new Error('No post found!')
      }

      return posts
    } catch (e: any) {
      throw new Error(e)
    }
  },

  create: async (props: { post: PostInput }, context: ContextProps): Promise<Post> => {
    const {
      post: { content }
    } = props
    try {
      const currentUser = authGuard(context.headers.authorization)

      const schema = yup.object().shape({
        content: yup.string().required().max(280)
      })
      schema.validateSync({ content })

      const query = await Db.client.query('INSERT INTO post (employeeid, content) VALUES ($1, $2) RETURNING id;', [currentUser.id, content])

      const { id } = query.rows[0] as ReturningIdProps

      const post = await Db.client.query('SELECT * FROM post where id = $1', [id])

      return postToPublicEntity(post.rows[0])
    } catch (e: any) {
      throw new Error(e)
    }
  }
}
