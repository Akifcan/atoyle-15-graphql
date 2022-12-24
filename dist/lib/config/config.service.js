'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            }
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const dotenv_1 = __importDefault(require('dotenv'))
const yup = __importStar(require('yup'))
class ConfigService {
  static initialize() {
    var _a, _b, _c, _d, _e, _f, _g
    dotenv_1.default.config()
    const vars = Object.assign({}, process.env)
    const schema = yup.object().shape({
      APP_NAME: yup.string().required(),
      DATABASE_NAME: yup.string().required(),
      DATABASE_USER: yup.string().required(),
      DATABASE_PASSWORD: yup.string().required(),
      DATABASE_HOST: yup.string().required(),
      PORT: yup.number().required(),
      DATABASE_PORT: yup.number().required(),
      JWT_SECRET: yup.string().required()
    })
    schema.validateSync(vars)
    ConfigService.jwt = {
      secret:
        (_a = process.env.JWT_SECRET) !== null && _a !== void 0
          ? _a
          : 'jwtsecret'
    }
    ConfigService.app = {
      port: Number(process.env.PORT),
      name:
        (_b = process.env.APP_NAME) !== null && _b !== void 0 ? _b : 'node-app'
    }
    ConfigService.db = {
      user:
        (_c = process.env.DATABASE_USER) !== null && _c !== void 0
          ? _c
          : 'root',
      password:
        (_d = process.env.DATABASE_PASSWORD) !== null && _d !== void 0
          ? _d
          : '',
      port:
        (_e = Number(process.env.DATABASE_PORT)) !== null && _e !== void 0
          ? _e
          : 5432,
      database:
        (_f = process.env.DATABASE_NAME) !== null && _f !== void 0 ? _f : '',
      host:
        (_g = process.env.DATABASE_HOST) !== null && _g !== void 0
          ? _g
          : 'localhost'
    }
  }
}
exports.default = ConfigService
