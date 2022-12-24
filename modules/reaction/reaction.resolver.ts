import { authGuard, ContextProps } from '../../lib/helpers'

export const reactionResolvers = {
  showReactions: async (props: any, context: ContextProps): Promise<String> => {
    authGuard(context.headers.authorization)
    return 'ok'
  },
  giveReaction: async (props: any, context: ContextProps): Promise<string> => {
    authGuard(context.headers.authorization)
    return 'give!'
  }
}
