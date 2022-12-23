'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.userResolvers = void 0
exports.userResolvers = {
  hello: () => {
    return 'Hello world!'
  },
  demo: () => {
    return 17
  },
  signIn: (props) => {
    const { user } = props
    return user
  }
}
