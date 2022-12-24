import request from 'supertest'
import { MOCK_JWT } from './index'
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

  test('it should create comment', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const query = `
        mutation CREATE_COMMENT($content: String!, $postid: ID!) {
            createComment(comment:{content: $content,  postid: $postid}) {
                content,
                date,
                id,
                employeeid,
                employee {
                name,
                email,
                password,
                createdat,
                isactive,
                id,
                description,
                slug
                }
            }
        }
    `
    const variables = {
      content: 'ttttttest',
      postid: testPost.rows[0].id
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', MOCK_JWT)
      .send(JSON.stringify({ query, variables }))

    const { createComment } = response.body.data
    expect(createComment).toHaveProperty('id')
    expect(createComment).toHaveProperty('employeeid')
    expect(createComment).toHaveProperty('content')
    expect(createComment).toHaveProperty('date')
    expect(createComment.employee).toHaveProperty('id')
    expect(createComment.employee).toHaveProperty('name')
    expect(createComment.employee).toHaveProperty('password')
    expect(createComment.employee).toHaveProperty('email')
    expect(createComment.employee).toHaveProperty('createdat')
    expect(createComment.employee).toHaveProperty('isactive')
    expect(createComment.employee).toHaveProperty('slug')
    expect(createComment.employee).toHaveProperty('description')

    await Db.client.query('DELETE FROM post where ID = $1', [testPost.rows[0].id])
  })

  test('it should throw error when not valid', async () => {
    let id: number = 0
    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsftesting') RETURNING id
        `
    )

    id = testPost.rows[0].id

    const query = `
        mutation CREATE_COMMENT($content: String!, $postid: ID!) {
            createComment(comment:{content: $content,  postid: $postid}) {
                content,
                date,
                id,
                employeeid,
                employee {
                name,
                email,
                password,
                createdat,
                isactive,
                id,
                description,
                slug
                }
            }
        }
    `
    const variables = {
      content: '',
      postid: id
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', MOCK_JWT)
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('content is a required field')
    await Db.client.query('DELETE FROM post where ID = $1', [id])
  })

  test('it should throw error when not jwt given', async () => {
    let id = 0
    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsftesting') RETURNING id
        `
    )

    id = testPost.rows[0].id

    const query = `
        mutation CREATE_COMMENT($content: String!, $postid: ID!) {
            createComment(comment:{content: $content,  postid: $postid}) {
                content,
                date,
                id,
                employeeid,
                employee {
                name,
                email,
                password,
                createdat,
                isactive,
                id,
                description,
                slug
                }
            }
        }
    `
    const variables = {
      content: 'asdf',
      postid: id
    }

    const response = await request(app).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json').send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('jwt must be provided')

    // expect(response.body.errors[0].message).toBe('content is a required field')
    await Db.client.query('DELETE FROM post where ID = $1', [id])
  })

  test('it should throw error when attempt give postid and commentid at the same time', async () => {
    let id: number = 0

    const query = `
      mutation CREATE_COMMENT($content: String!, $commentId: ID!, $postId: ID!) {
        createComment(comment:{content: $content,  commentid: $commentId, postid: $postId}) {
          content,
          date,
          id,
          employeeid,
          employee {
            name,
            email,
            password,
            createdat,
            isactive,
            id,
            description,
            slug
          }
        }
      }
    `

    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsf') RETURNING id
        `
    )

    id = testPost.rows[0].id

    const testComment = await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [id]
    )

    const variables = {
      content: 'adfasfasdf',
      postId: id,
      commentId: testComment.rows[0].id
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', MOCK_JWT)
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('You can only create comment for post or comment not both')

    await Db.client.query('DELETE FROM post where ID = $1', [id])
  })

  test('it should list single comment', async () => {
    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsf') RETURNING id
        `
    )

    const postId = testPost.rows[0].id

    const testComment = await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [postId]
    )

    const commentId = testComment.rows[0].id

    const query = `
        query SINGLE_COMMENT($id: ID!) {
          comment(id: $id) {
            content,
            date,
            commentid,
            id,
            employeeid,
            employee {
              name,
              email,
              password,
              createdat,
              isactive,
              id,
              description,
              slug
            }
          }
        }
      `

    const variables = {
      id: commentId
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', MOCK_JWT)
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    const { comment } = response.body.data

    expect(comment).toHaveProperty('id')
    expect(comment).toHaveProperty('employeeid')
    expect(comment).toHaveProperty('content')
    expect(comment).toHaveProperty('commentid')
    expect(comment).toHaveProperty('date')
    expect(comment.employee).toHaveProperty('id')
    expect(comment.employee).toHaveProperty('name')
    expect(comment.employee).toHaveProperty('password')
    expect(comment.employee).toHaveProperty('email')
    expect(comment.employee).toHaveProperty('createdat')
    expect(comment.employee).toHaveProperty('isactive')
    expect(comment.employee).toHaveProperty('slug')
    expect(comment.employee).toHaveProperty('description')

    await Db.client.query('DELETE FROM post where ID = $1', [postId])
  })

  test('it shouldnt list single comment if no jwt given', async () => {
    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsf') RETURNING id
        `
    )

    const postId = testPost.rows[0].id

    const testComment = await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [postId]
    )

    const commentId = testComment.rows[0].id

    const query = `
        query SINGLE_COMMENT($id: ID!) {
          comment(id: $id) {
            content,
            date,
            commentid,
            id,
            employeeid,
            employee {
              name,
              email,
              password,
              createdat,
              isactive,
              id,
              description,
              slug
            }
          }
        }
      `

    const variables = {
      id: commentId
    }

    const response = await request(app).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json').send(JSON.stringify({ query, variables }))

    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('jwt must be provided')

    await Db.client.query('DELETE FROM post where ID = $1', [postId])
  })

  test('it should comment list replies', async () => {
    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsf') RETURNING id
        `
    )

    const postId = testPost.rows[0].id

    const testComment = await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [postId]
    )

    const commentId = testComment.rows[0].id

    await Db.client.query(
      `
          INSERT INTO comment (employeeid, commentid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [commentId]
    )

    await Db.client.query(
      `
          INSERT INTO comment (employeeid, commentid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [commentId]
    )

    await Db.client.query(
      `
          INSERT INTO comment (employeeid, commentid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [commentId]
    )

    const query = `
      query COMMENT_REPLIES($id: ID!) {
        commentReplies(options:{id: $id, page: 1, order:"desc"}) {
            content,
          date,
          commentid,
          postid,
          id,
          employeeid,
          employee {
            name,
            email,
            password,
            createdat,
            isactive,
            id,
            department,
            description,
            slug
          }
        }
      }
    `

    const variables = {
      id: commentId
    }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', MOCK_JWT)
      .set('Accept', 'application/json')
      .send(JSON.stringify({ query, variables }))

    const { commentReplies } = response.body.data

    expect(Array.isArray(commentReplies)).toBe(true)

    const comment = commentReplies[0]

    expect(comment).toHaveProperty('id')
    expect(comment).toHaveProperty('employeeid')
    expect(comment).toHaveProperty('content')
    expect(comment).toHaveProperty('postid')
    expect(comment).toHaveProperty('commentid')
    expect(comment).toHaveProperty('date')
    expect(comment.employee).toHaveProperty('id')
    expect(comment.employee).toHaveProperty('name')
    expect(comment.employee).toHaveProperty('password')
    expect(comment.employee).toHaveProperty('department')
    expect(comment.employee).toHaveProperty('email')
    expect(comment.employee).toHaveProperty('createdat')
    expect(comment.employee).toHaveProperty('isactive')
    expect(comment.employee).toHaveProperty('slug')
    expect(comment.employee).toHaveProperty('description')

    await Db.client.query('DELETE FROM post where ID = $1', [postId])
  })

  test('it should  list post comments', async () => {
    const testPost = await Db.client.query(
      `
          INSERT INTO post (employeeid, content)
          VALUES (3, 'fsaadsf') RETURNING id
        `
    )

    const postId = testPost.rows[0].id

    await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [postId]
    )
    await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [postId]
    )

    await Db.client.query(
      `
          INSERT INTO comment (employeeid, postid, content)
          VALUES (3, $1, 'TEST COMMENT!!!!!') RETURNING id
        `,
      [postId]
    )

    const query = `
        query POST_COMMENTS($id: ID!) {
          postComments(options:{id: $id, page: 1, order:"desc"}) {
            content,
            date,
            postid,
            id,
            commentid,
            employeeid,
            employee {
              name,
              email,
              password,
              createdat,
              isactive,
              department,
              id,
              description,
              slug
            }
          }
        }
      `

    const variables = { id: postId }

    const response = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', MOCK_JWT)
      .send(JSON.stringify({ query, variables }))

    const { postComments } = response.body.data

    expect(Array.isArray(postComments)).toBe(true)

    const comment = postComments[0]

    expect(comment).toHaveProperty('id')
    expect(comment).toHaveProperty('employeeid')
    expect(comment).toHaveProperty('content')
    expect(comment).toHaveProperty('postid')
    expect(comment).toHaveProperty('commentid')
    expect(comment).toHaveProperty('date')
    expect(comment.employee).toHaveProperty('id')
    expect(comment.employee).toHaveProperty('name')
    expect(comment.employee).toHaveProperty('password')
    expect(comment.employee).toHaveProperty('department')
    expect(comment.employee).toHaveProperty('email')
    expect(comment.employee).toHaveProperty('createdat')
    expect(comment.employee).toHaveProperty('isactive')
    expect(comment.employee).toHaveProperty('slug')
    expect(comment.employee).toHaveProperty('description')

    await Db.client.query('DELETE FROM post where ID = $1', [postId])
  })
})
