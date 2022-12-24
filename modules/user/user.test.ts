import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'
import { MOCK_JWT } from '../../test'
import { userResolvers } from './user.resolver'

describe('Test the root path', () => {
  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('It should sign in when credentials are correct', async () => {
    const user = await userResolvers.signIn({
      email: 'akif@mail.com',
      password: '124'
    })

    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('token')
  })

  test('It should throw error if credentials are wrong', async () => {
    try {
      await userResolvers.signIn({
        email: 'akiasdfasdf@mail.com',
        password: '124'
      })
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e).toHaveProperty('message', 'This user not found')
    }
  })

  test('It should throw error if inputs are not valid', async () => {
    try {
      await userResolvers.signIn({
        email: 'akia',
        password: '1asdf24'
      })
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e).toHaveProperty('message')
    }
  })

  test('It should return profile props', async () => {
    const response = await userResolvers.profile({ slug: 'akif-kara' }, { headers: { authorization: MOCK_JWT } })

    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('name')
    expect(response).toHaveProperty('department')
    expect(response).toHaveProperty('description')
    expect(response).toHaveProperty('email')
    expect(response).toHaveProperty('slug')
  })

  test('It should throw error if profile does not found', async () => {
    try {
      await userResolvers.profile({ slug: 'asdfasdfasdf' }, { headers: { authorization: MOCK_JWT } })
      expect(true).toBe(false)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e).toHaveProperty('message', 'This user not found')
    }
  })

  test('It should throw error if no jwt provided', async () => {
    try {
      await userResolvers.profile({ slug: 'asdfasdfasdf' }, { headers: { authorization: '' } })

      expect(true).toBe(false)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e).toHaveProperty('message', 'jwt must be provided')
    }
  })

  test('It should throw error if jwt regex is wrong', async () => {
    try {
      await userResolvers.profile({ slug: 'asdfasdfasdf' }, { headers: { authorization: 'fasdfasdf' } })

      expect(true).toBe(false)
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
      expect(e).toHaveProperty('message', 'jwt malformed')
    }
  })
})
