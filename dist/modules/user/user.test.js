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
const db_postgres_1 = __importDefault(require('../../lib/db/db.postgres'))
const startup_1 = __importDefault(require('../../lib/startup'))
describe('Test the root path', () => {
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield (0, startup_1.default)()
    })
  )
  afterAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield db_postgres_1.default.client.end()
    })
  )
  test('It should return 17', () => {
    expect(17).toBe(17)
  })
})
