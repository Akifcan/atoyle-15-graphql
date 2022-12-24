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
exports.postResolvers = void 0
const helpers_1 = require('../../lib/helpers')
const yup = __importStar(require('yup'))
const db_postgres_1 = __importDefault(require('../../lib/db/db.postgres'))
const post_transformer_1 = require('./post.transformer')
exports.postResolvers = {
  post: (props, context) =>
    __awaiter(void 0, void 0, void 0, function* () {
      ;(0, helpers_1.authGuard)(context.headers.authorization)
      const { id } = props
      const post = yield db_postgres_1.default.client.query(
        `
      SELECT * FROM post INNER JOIN employee ON post.employeeid = employee.id
      WHERE post.id = $1
    `,
        [id]
      )
      if (post.rows.length === 0) {
        throw new Error('No post found!')
      }
      return (0, post_transformer_1.postToPublicEntity)(post.rows[0])
    }),
  posts: (props, context) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        ;(0, helpers_1.authGuard)(context.headers.authorization)
        const {
          options: { department, page, userId, order }
        } = props
        const currentPage = (page - 1) * helpers_1.RESULTS_PER_PAGE
        let filterByDepartmentQuery = ''
        let filterByUserQuery = ''
        if (
          department !== undefined &&
          department !== null &&
          department.length > 0
        ) {
          filterByDepartmentQuery = `WHERE employee.department = '${department}'`
        }
        if (userId !== undefined && userId !== null) {
          filterByUserQuery = `${
            filterByDepartmentQuery !== undefined ? 'AND' : 'WHERE'
          }  employee.id = ${userId}`
        }
        const query = yield db_postgres_1.default.client.query(
          `
        SELECT * FROM post INNER JOIN employee ON post.employeeid = employee.id 
        ${filterByDepartmentQuery}
        ${filterByUserQuery}
        ORDER BY date ${order}
        LIMIT $1 OFFSET $2;
      `,
          [helpers_1.RESULTS_PER_PAGE, currentPage]
        )
        const posts = (0, post_transformer_1.postsToPublicEntity)(query)
        if (posts.length === 0) {
          throw new Error('No post found!')
        }
        return posts
      } catch (e) {
        console.log(e)
        throw new Error(e)
      }
    }),
  create: (props, context) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const {
        post: { content }
      } = props
      const currentUser = (0, helpers_1.authGuard)(
        context.headers.authorization
      )
      const schema = yup.object().shape({
        content: yup.string().required().max(280)
      })
      schema.validateSync({ content })
      try {
        const query = yield db_postgres_1.default.client.query(
          'INSERT INTO post (employeeid, content) VALUES ($1, $2) RETURNING id;',
          [currentUser.id, content]
        )
        const { id } = query.rows[0]
        const post = yield db_postgres_1.default.client.query(
          'SELECT * FROM post where id = $1',
          [id]
        )
        return post.rows[0]
      } catch (e) {
        console.log(e)
        throw new Error('Unexcepted error occured please try again')
      }
    })
}
