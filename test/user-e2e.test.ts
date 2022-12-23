import request from 'supertest'
import app from '../lib/app'
import Db from '../lib/db/db.postgres'
import startup from '../lib/startup'

describe('Test the root path', () => {
  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('It should have hello property', async () => {
    const query = 'query HELLO { hello } '

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query }))
    const { data } = response.body
    expect(data).toHaveProperty('hello')
  })
})
