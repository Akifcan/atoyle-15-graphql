import request from 'supertest'
import { MOCK_JWT } from '.'
import app from '../lib/app'
import Db from '../lib/db/db.postgres'
import startup from '../lib/startup'
import { reactionResolvers } from '../modules/reaction/reaction.resolver'

describe('Test the root path', () => {
  const akifToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IsSxcm1hayIsInBhc3N3b3JkIjoiMTIzIiwiZGVwYXJ0bWVudCI6ImhyIiwiZW1haWwiOiJpcm1ha0BtYWlsLmNvbSIsImNyZWF0ZWRhdCI6IjIwMjItMTItMjNUMTk6MTE6MjMuMTk4WiIsImlzYWN0aXZlIjp0cnVlLCJzbHVnIjoiaXJtYWsiLCJkZXNjcmlwdGlvbiI6ImhlbGxvIGltIMSxcm1hayIsImlhdCI6MTY3MTg5NDAwOX0.iGQGpYOnIgsOGCC2U6zLJgfTgW6d5bem0PVNAOHIO-Y'
  const denizToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6ImRlbml6IiwicGFzc3dvcmQiOiIxMjQiLCJkZXBhcnRtZW50IjoiaHIiLCJlbWFpbCI6ImRlbml6QG1haWwuY29tIiwiY3JlYXRlZGF0IjoiMjAyMi0xMi0yNFQwMjo1ODo1NS43MjNaIiwiaXNhY3RpdmUiOnRydWUsInNsdWciOiJkZW5penp6eiIsImRlc2NyaXB0aW9uIjpudWxsLCJpYXQiOjE2NzE4OTQwODl9.2khsNMLuwXXEd0zK-MNa8qG6f_SzvAQ05OS27_DHiXA'
  const sebnemFerahToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6IsWfZWJuZW0gZmVyYWgiLCJwYXNzd29yZCI6IjEyNCIsImRlcGFydG1lbnQiOiJociIsImVtYWlsIjoic2VibmVtQG1haWwuY29tIiwiY3JlYXRlZGF0IjoiMjAyMi0xMi0yNFQwMjo1ODo1NS43MjNaIiwiaXNhY3RpdmUiOnRydWUsInNsdWciOiJzZWJuZW0tZmVyYWgiLCJkZXNjcmlwdGlvbiI6bnVsbCwiaWF0IjoxNjcxODk0MzE0fQ.tqlvA2KA22-h_0HWNt_aRhX2FSgP00j70RkPLoayr1Y'

  beforeAll(async () => {
    await startup()
  })

  afterAll(async () => {
    await Db.client.end()
  })

  test('it should react the post and revoke the react', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const query = `
        mutation GIVE_POST_REACTION($postId: ID!) {
            givePostReaction(reaction: {reactionid: 1, postid: $postId}) {
                success,
                text
            }
        } 
    `

    const variables = {
      postId: postid
    }

    // Give first reaction
    await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)

    const { givePostReaction } = response.body.data

    expect(givePostReaction.success).toBe(true)
    expect(givePostReaction.text).toBe('You reaction has been revoked from this post')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should react the post', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const query = `
        mutation GIVE_POST_REACTION($postId: ID!) {
            givePostReaction(reaction: {reactionid: 1, postid: $postId}) {
                success,
                text
            }
        } 
    `

    const variables = {
      postId: postid
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)

    const { givePostReaction } = response.body.data

    expect(givePostReaction.success).toBe(true)
    expect(givePostReaction.text).toBe('You just reacted this post')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should throw error if no jwt given', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsftest!') RETURNING id
      `
    )
    const postid = testPost.rows[0].id

    const query = `
        mutation GIVE_POST_REACTION($postId: ID!) {
            givePostReaction(reaction: {reactionid: 1, postid: $postId}) {
                success,
                text
            }
        } 
    `

    const variables = {
      postId: postid
    }

    const response = await request(app).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json').send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('jwt must be provided')
  })

  test('it should react the post and revoke the react', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const query = `
        mutation GIVE_POST_REACTION($postId: ID!) {
            givePostReaction(reaction: {reactionid: 1, postid: $postId}) {
                success,
                text
            }
        } 
    `

    const variables = {
      postId: postid
    }

    await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: MOCK_JWT } })

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)

    const { givePostReaction } = response.body.data

    expect(givePostReaction.success).toBe(true)
    expect(givePostReaction.text).toBe('You reaction has been revoked from this post')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should react the comment', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const testComment = await Db.client.query('INSERT INTO comment (employeeid, postid, content) VALUES(3, $1, $2) RETURNING id', [postid, 'testcomment!'])
    const commentid = testComment.rows[0].id

    const query = `
        mutation GIVE_COMMENT_REACTION($commentId: ID!) {
            giveCommentReaction(reaction: {reactionid: 1, commentid: $commentId}) {
                success,
                text
            }
        } 
    `

    const variables = {
      commentId: commentid
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)

    const { giveCommentReaction } = response.body.data

    expect(giveCommentReaction.success).toBe(true)
    expect(giveCommentReaction.text).toBe('You just reacted this comment')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should react the comment and revoke the react', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const testComment = await Db.client.query('INSERT INTO comment (employeeid, postid, content) VALUES(3, $1, $2) RETURNING id', [postid, 'testcomment!'])
    const commentid = testComment.rows[0].id

    const query = `
        mutation GIVE_COMMENT_REACTION($commentId: ID!) {
            giveCommentReaction(reaction: {reactionid: 1, commentid: $commentId}) {
                success,
                text
            }
        } 
    `

    const variables = {
      commentId: commentid
    }

    // Give first reaction
    await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)
    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', MOCK_JWT)

    const { giveCommentReaction } = response.body.data

    expect(giveCommentReaction.success).toBe(true)
    expect(giveCommentReaction.text).toBe('You reaction has been revoked from this comment')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should list reacted user for a post', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const giveReactQuery = `
        mutation GIVE_POST_REACTION($postId: ID!) {
            givePostReaction(reaction: {reactionid: 1, postid: $postId}) {
                success,
                text
            }
        } 
    `

    const giveReactVariables = { postId: postid }

    const query = `
        query SHOW_POST_REACTED_USERS($postId: ID!) {
            showPostReactedUsers(id: $postId) {
                id,
                employee {
                    name,
                    email
                    },
                    type {
                    id
                    name,
                    emoji
                }
            }
        }
    `

    const variables = {
      postId: postid
    }
    // Akif gives react
    await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query: giveReactQuery, variables: giveReactVariables }))
      .set('Authorization', akifToken)

    // Deniz gives react
    await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query: giveReactQuery, variables: giveReactVariables }))
      .set('Authorization', denizToken)

    //   Sebnem ferah gives react
    await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query: giveReactQuery, variables: giveReactVariables }))
      .set('Authorization', sebnemFerahToken)

    //   Sebnem ferah gives react
    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))
      .set('Authorization', sebnemFerahToken)

    const { showPostReactedUsers } = response.body.data

    expect(Array.isArray(showPostReactedUsers)).toBe(true)
    const react = showPostReactedUsers[0]
    expect(react).toHaveProperty('id')
    expect(react).toHaveProperty('employee')
    expect(react.employee).toHaveProperty('name')
    expect(react.employee).toHaveProperty('email')
    expect(react).toHaveProperty('type')
    expect(react.type).toHaveProperty('id')
    expect(react.type).toHaveProperty('name')
    expect(react.type).toHaveProperty('emoji')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })
})
