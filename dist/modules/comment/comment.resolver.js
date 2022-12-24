'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.commentResolvers = void 0
const helpers_1 = require('../../lib/helpers')
exports.commentResolvers = {
  comment: (props, context) =>
    __awaiter(void 0, void 0, void 0, function* () {
      console.log('ok')
      // const schema = yup.object().shape({
      //   email: yup.string().email().required().max(100),
      //   password: yup.string().required().max(100)
      // })
      // schema.validateSync({ email, password })
      ;(0, helpers_1.authGuard)(context.headers.authorization)
      return 'ok'
    })
}
