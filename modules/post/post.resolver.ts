import { authGuard, ContextProps } from '../../lib/helpers'
import { PostInput } from './post.interface'

export const postResolvers = {
  create: async (props: PostInput, context: ContextProps): Promise<string> => {
    console.log('ok')

    // const schema = yup.object().shape({
    //   email: yup.string().email().required().max(100),
    //   password: yup.string().required().max(100)
    // })
    // schema.validateSync({ email, password })

    authGuard(context.headers.authorization)

    return 'ok'
  }
}
