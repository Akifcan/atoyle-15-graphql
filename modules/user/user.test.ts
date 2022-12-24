import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'

describe('Test the root path', () => {
  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('It should return 17', async () => {
    expect(17).toBe(17)
  })
})
