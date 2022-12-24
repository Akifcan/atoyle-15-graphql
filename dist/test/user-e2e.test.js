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
const supertest_1 = __importDefault(require('supertest'))
const _1 = require('.')
const app_1 = __importDefault(require('../lib/app'))
const db_postgres_1 = __importDefault(require('../lib/db/db.postgres'))
const startup_1 = __importDefault(require('../lib/startup'))
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
  test('It should sign in when credentials are correct', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const query = `
      mutation SIGN_IN($email: String!, $password: String!) {
        signIn (email:$email, password:$password){
          name,
          email,
          id,
          token,
        }
      }
    `
      const variables = { email: 'akif@mail.com', password: '124' }
      const response = yield (0, supertest_1.default)(app_1.default)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(JSON.stringify({ query, variables }))
      expect(response.body.data).toHaveProperty('signIn')
      const { signIn } = response.body.data
      expect(signIn).toHaveProperty('name')
      expect(signIn).toHaveProperty('email')
      expect(signIn).toHaveProperty('id')
      expect(signIn).toHaveProperty('token')
    }))
  test('It should throw error if inputs are not valid', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const query = `
      mutation SIGN_IN($email: String!, $password: String!) {
        signIn (email:$email, password:$password){
          name,
          email,
          id,
          token,
        }
      }
    `
      const variables = { email: '', password: '' }
      const response = yield (0, supertest_1.default)(app_1.default)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(JSON.stringify({ query, variables }))
      expect(response.body).toHaveProperty('errors')
    }))
  test('It should throw error if credentials are wrong', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const query = `
      mutation SIGN_IN($email: String!, $password: String!) {
        signIn (email:$email, password:$password){
          name,
          email,
          id,
          token,
        }
      }
    `
      const variables = { email: 'asdfasdf@mail.com', password: 'xxxx' }
      const response = yield (0, supertest_1.default)(app_1.default)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(JSON.stringify({ query, variables }))
      expect(response.body).toHaveProperty('errors')
    }))
  test('It should return profile props', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const query = `
      query USER_PROFILE {
        profile(slug:"akif-kara") {
          name,
          description,
          slug,
          id,
          email
        }
      }
    `
      const variables = { slug: 'akif-kara' }
      const response = yield (0, supertest_1.default)(app_1.default)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', _1.MOCK_JWT)
        .send(JSON.stringify({ query, variables }))
      expect(response.body.data).toHaveProperty('profile')
      const { profile } = response.body.data
      expect(profile).toHaveProperty('name')
      expect(profile).toHaveProperty('description')
      expect(profile).toHaveProperty('slug')
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('email')
    }))
  test('It should throw error if jwt not exists', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const query = `
      query USER_PROFILE {
        profile(slug:"akif-kara") {
          name,
          description,
          slug,
          id,
          email
        }
      }
    `
      const variables = { slug: 'akif-kara' }
      const response = yield (0, supertest_1.default)(app_1.default)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(JSON.stringify({ query, variables }))
      expect(response.body).toHaveProperty('errors')
    }))
  test('It should throw error if user slug does not found', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const query = `
      query USER_PROFILE {
        profile(slug:"asdfasdfasdf") {
          name,
          description,
          slug,
          id,
          email
        }
      }
    `
      const variables = { slug: 'akif-kara' }
      const response = yield (0, supertest_1.default)(app_1.default)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(JSON.stringify({ query, variables }))
      expect(response.body).toHaveProperty('errors')
    }))
})
