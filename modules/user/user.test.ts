import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'
import { userResolvers } from './user.resolver'

describe('Test the root path', () => {
  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('It should return 17', async () => {
    const response = userResolvers.demo()
    expect(response).toBe(17)
  })
})
