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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const config_service_1 = __importDefault(require('./config/config.service'))
const db_postgres_1 = __importDefault(require('./db/db.postgres'))
const startup = (useConsole = true) =>
  __awaiter(void 0, void 0, void 0, function* () {
    config_service_1.default.initialize()
    try {
      yield db_postgres_1.default.connect()
    } catch (e) {
      console.log(e)
    }
    if (useConsole) console.log('Connected to db!')
  })
exports.default = startup
