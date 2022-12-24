import { authGuard, ContextProps, ReturningIdProps } from '../../lib/helpers'
import * as yup from 'yup'
import { Post, PostInput } from './post.interface'
import Db from '../../lib/db/db.postgres'

export const postResolvers = {
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
