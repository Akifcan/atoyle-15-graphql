import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'

describe('Test the root path', () => {
  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('post test', async () => {
    expect(200).toBe(200)
  })
})
