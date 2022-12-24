import Db from '../../lib/db/db.postgres'
import { User, UserProfile } from './user.interface'
import * as yup from 'yup'
import { authGuard, ContextProps, signJwt } from '../../lib/helpers'

export const userResolvers = {
  profile: async (
    props: { slug: string },
    context: ContextProps
  ): Promise<UserProfile> => {
    const { slug } = props

    authGuard(context.headers.authorization)

    const query = await Db.client.query(
      'SELECT id, name, department, description, email, slug FROM employee WHERE slug = $1 AND isActive = true',
      [slug]
    )

    if (query.rows.length === 0) throw new Error('This user not found')

    return query.rows[0] as UserProfile
  },

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  signIn: async (props: { email: String; password: String }): Promise<User> => {
    const { email, password } = props

    const query = await Db.client.query(
      'SELECT * FROM employee where email = $1 AND password = $2 AND isActive = true',
      [email, password]
    )

    const schema = yup.object().shape({
      email: yup.string().email().required().max(100),
      password: yup.string().required().max(100)
    })

    schema.validateSync({ email, password })
    if (query.rows.length === 0) throw new Error('This user not found')

    const user = query.rows[0] as User

    const token = signJwt({ ...user })

    return { ...user, token }
  }
}
