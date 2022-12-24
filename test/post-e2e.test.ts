import request from 'supertest'
import { MOCK_JWT } from '.'
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

  test('it should return array when all posts listed', async () => {
    const query = `
        query LIST_ALL_POSTS($page: Int!) { 
            posts(options: {page: $page}) {
                content,
                id,
                content,
                date,
                employee {
                department,
                }
            }
        }
    `
    const variables = {
      page: 1
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', MOCK_JWT)
      .send(JSON.stringify({ query, variables }))

    const { posts } = response.body.data

    expect(Array.isArray(posts)).toBe(true)

    const post = posts[0]

    expect(post).toHaveProperty('id')
    expect(post).toHaveProperty('content')
    expect(post).toHaveProperty('date')
    expect(post).toHaveProperty('employee')
  })

  test('it should throw error when no jwt provided', async () => {
    const query = `
        query LIST_ALL_POSTS($page: Int!) { 
            posts(options: {page: $page}) {
                content,
                id,
                content,
                date,
                employee {
                department,
                }
            }
        }
    `
    const variables = {
      page: 1
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')

    expect(response.body.errors[0].message).toBe(
      'JsonWebTokenError: jwt must be provided'
    )
  })

  test('it should throw error when no more page', async () => {
    const query = `
        query LIST_ALL_POSTS($page: Int!) { 
            posts(options: {page: $page}) {
                content,
                id,
                content,
                date,
                employee {
                department,
                }
            }
        }
    `
    const variables = {
      page: 123
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', MOCK_JWT)
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('Error: No post found!')
  })

  test('it should return post props when a post created', async () => {
    const query = `
        mutation CREATE_POST($content: String!) {
            create(post:{content: $content}) {
                content,
                date,
                id,
                employeeid
            }
        }
    `
    const variables = {
      content: 'selammm TEST FROM E2E'
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', MOCK_JWT)
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body.data).toHaveProperty('create')
    const { create } = response.body.data
    expect(create).toHaveProperty('content')
    expect(create).toHaveProperty('date')
    expect(create).toHaveProperty('id')
    expect(create).toHaveProperty('employeeid')

    await Db.client.query('DELETE FROM post where id = $1', [create.id])
  })

  test('it should throw error when post input is not valid', async () => {
    const query = `
        mutation CREATE_POST($content: String!) {
            create(post:{content: $content}) {
                content,
                date,
                id,
                employeeid
            }
        }
    `
    const variables = {
      content: ''
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', MOCK_JWT)
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe(
      'ValidationError: content is a required field'
    )
  })
})
