import { authGuard, ContextProps } from '../../lib/helpers'

export const commentResolvers = {
  comment: async (props: any, context: ContextProps): Promise<string> => {
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
