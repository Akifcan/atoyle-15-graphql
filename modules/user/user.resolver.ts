import Db from '../../lib/db/db.postgres'
import { User } from './user.interface'

export const userResolvers = {
  hello: () => {
    return 'Hello world!'
  },
  demo: async (): Promise<number> => {
    try {
      const users = await Db.client.query('SELECT * FROM employee')
      console.log(users.rows)
      return 17
    } catch (e) {
      console.log(e)
      throw new Error()
    }
  },
  signIn: (props: { user: User }): User => {
    const { user } = props
    return user
  }
}
