import { authGuard, ContextProps } from '../../lib/helpers'
import { CommentInput } from './comment.interface'
import * as yup from 'yup'

export const commentResolvers = {
  createComment: async (
    props: { comment: CommentInput },
    context: ContextProps
  ): Promise<string> => {
    const {
      comment: { postid, commentid, content }
    } = props

    authGuard(context.headers.authorization)

    const schema = yup.object().shape({
      content: yup.string().required().max(280)
    })
    schema.validateSync({ content })

    return content
  }
}
