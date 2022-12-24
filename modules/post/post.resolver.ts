import {
  authGuard,
  ContextProps,
  RESULTS_PER_PAGE,
  ReturningIdProps
} from '../../lib/helpers'
import * as yup from 'yup'
import { Post, PostInput, PostListProps } from './post.interface'
import Db from '../../lib/db/db.postgres'
import { postToPublicEntity } from './post.transformer'

export const postResolvers = {
  posts: async (
    props: { options: PostListProps },
    context: ContextProps
  ): Promise<Post[]> => {
    authGuard(context.headers.authorization)

    const {
      options: { department, page, userId }
    } = props

    const currentPage = (page - 1) * RESULTS_PER_PAGE

    let filterByDepartmentQuery = ''
    let filterByUserQuery = ''

    if (
      department !== undefined &&
      department !== null &&
      department.length > 0
    ) {
      filterByDepartmentQuery = `WHERE employee.department = '${department}'`
    }

    if (userId !== undefined && userId !== null) {
      filterByUserQuery = `${
        filterByDepartmentQuery !== undefined ? 'AND' : 'WHERE'
      }  employee.id = ${userId}`
    }

    const query = await Db.client.query(
      `
        SELECT * FROM post INNER JOIN employee ON post.employeeid = employee.id 
        ${filterByDepartmentQuery}
        ${filterByUserQuery}
        ORDER BY date DESC 
        LIMIT $1 OFFSET $2;
      `,
      [RESULTS_PER_PAGE, currentPage]
    )

    const posts = postToPublicEntity(query)

    if (posts.length === 0) {
      throw new Error('No post found!')
    }

    return postToPublicEntity(query)
  },

  create: async (
    props: { post: PostInput },
    context: ContextProps
  ): Promise<Post> => {
    const {
      post: { content }
    } = props

    const currentUser = authGuard(context.headers.authorization)

    const schema = yup.object().shape({
      content: yup.string().required().max(280)
    })
    schema.validateSync({ content })

    try {
      const query = await Db.client.query(
        'INSERT INTO post (employeeid, content) VALUES ($1, $2) RETURNING id;',
        [currentUser.id, content]
      )

      const { id } = query.rows[0] as ReturningIdProps

      const post = await Db.client.query('SELECT * FROM post where id = $1', [
        id
      ])

      return post.rows[0] as Post
    } catch (e: any) {
      console.log(e)
      throw new Error('Unexcepted error occured please try again')
    }
  }
}
