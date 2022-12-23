import { User } from './user.interface'

export const userResolvers = {
  hello: () => {
    return 'Hello world!'
  },
  demo: () => {
    return 17
  },
  signIn: (props: { user: User }): User => {
    const { user } = props
    return user
  }
}
