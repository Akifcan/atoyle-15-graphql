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
const pg_1 = require('pg')
const config_service_1 = __importDefault(require('../config/config.service'))
class Db {
  static connect() {
    return __awaiter(this, void 0, void 0, function* () {
      const client = new pg_1.Client({
        user: config_service_1.default.db.user,
        host: config_service_1.default.db.host,
        password: config_service_1.default.db.password,
        database: config_service_1.default.db.database,
        port: config_service_1.default.db.port
      })
      yield client.connect()
      Db.client = client
      return client
    })
  }
}
exports.default = Db
