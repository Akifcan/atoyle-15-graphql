import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'
import { MOCK_JWT } from '../../test'
import { postResolvers } from './post.resolver'

describe('Test the root path', () => {
  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('it should return array when all posts listed', async () => {
    const response = await postResolvers.posts(
      {
        options: {
          page: 1,
          order: 'desc'
        }
      },
      { headers: { authorization: MOCK_JWT } }
    )

    expect(Array.isArray(response)).toBe(true)
    const post = response[0]

    expect(post).toHaveProperty('id')
    expect(post).toHaveProperty('employeeid')
    expect(post).toHaveProperty('content')
    expect(post).toHaveProperty('date')
    expect(post).toHaveProperty('employee')
  })

  test('it should throw error when no more page', async () => {
    try {
      await postResolvers.posts(
        {
          options: {
            page: 1232323,
            order: 'desc'
          }
        },
        { headers: { authorization: MOCK_JWT } }
      )

      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e).toHaveProperty('message', 'Error: No post found!')
    }
  })
})
