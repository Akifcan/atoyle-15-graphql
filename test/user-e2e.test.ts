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

  test('It should sign in when credentials are correct', async () => {
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

    const response = await request(app)
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
  })

  test('It should throw error if inputs are not valid', async () => {
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

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
  })

  test('It should throw error if credentials are wrong', async () => {
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

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
  })

  test('It should return profile props', async () => {
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

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', MOCK_JWT)
      .send(JSON.stringify({ query, variables }))

    expect(response.body.data).toHaveProperty('profile')
    const { profile } = response.body.data
    expect(profile).toHaveProperty('name')
    expect(profile).toHaveProperty('description')
    expect(profile).toHaveProperty('slug')
    expect(profile).toHaveProperty('id')
    expect(profile).toHaveProperty('email')
  })

  test('It should throw error if jwt not exists', async () => {
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

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
  })

  test('It should throw error if user slug does not found', async () => {
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

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
  })
})
