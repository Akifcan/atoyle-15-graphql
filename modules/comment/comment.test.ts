import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'
import { MOCK_JWT } from '../../test'
import { commentResolvers } from './comment.resolver'

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

    const response = await commentResolvers.createComment(
      {
        comment: { content: 'TEST COMMENT !!!', postid: testPost.rows[0].id }
      },
      {
        headers: {
          authorization: MOCK_JWT
        }
      }
    )

    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('employeeid')
    expect(response).toHaveProperty('content')
    expect(response).toHaveProperty('postid')
    expect(response).toHaveProperty('commentid')
    expect(response).toHaveProperty('date')
    expect(response.employee).toHaveProperty('id')
    expect(response.employee).toHaveProperty('name')
    expect(response.employee).toHaveProperty('password')
    expect(response.employee).toHaveProperty('department')
    expect(response.employee).toHaveProperty('email')
    expect(response.employee).toHaveProperty('createdat')
    expect(response.employee).toHaveProperty('isactive')
    expect(response.employee).toHaveProperty('slug')
    expect(response.employee).toHaveProperty('description')

    await Db.client.query('DELETE FROM post where ID = $1', [testPost.rows[0].id])
  })

  test('it should throw error when not valid', async () => {
    let id: number = 0
    try {
      const testPost = await Db.client.query(
        `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsftesting') RETURNING id
      `
      )

      id = testPost.rows[0].id

      await commentResolvers.createComment(
        {
          comment: {
            content: '',
            postid: testPost.rows[0].id
          }
        },
        {
          headers: {
            authorization: MOCK_JWT
          }
        }
      )

      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('content is a required field')
    } finally {
      await Db.client.query('DELETE FROM post where ID = $1', [id])
    }
  })

  test('it should throw error when not jwt given', async () => {
    let id: number = 0
    try {
      const testPost = await Db.client.query(
        `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsftesting') RETURNING id
      `
      )

      id = testPost.rows[0].id

      await commentResolvers.createComment(
        {
          comment: {
            content: '',
            postid: testPost.rows[0].id
          }
        },
        {
          headers: {
            authorization: ''
          }
        }
      )

      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('jwt must be provided')
    } finally {
      await Db.client.query('DELETE FROM post where ID = $1', [id])
    }
  })

  test('it should throw error when attempt give postid and commentid at the same time', async () => {
    let id: number = 0

    try {
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

      await commentResolvers.createComment(
        {
          comment: {
            content: 'fasdfasdf',
            postid: testPost.rows[0].id,
            commentid: testComment.rows[0].id
          }
        },
        {
          headers: {
            authorization: MOCK_JWT
          }
        }
      )

      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('You can only create comment for post or comment not both')
    } finally {
      await Db.client.query('DELETE FROM post where ID = $1', [id])
    }
  })

  test('it should list single comment', async () => {
    const response = await commentResolvers.comment(
      {
        id: 2
      },
      { headers: { authorization: MOCK_JWT } }
    )

    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('employeeid')
    expect(response).toHaveProperty('content')
    expect(response).toHaveProperty('postid')
    expect(response).toHaveProperty('commentid')
    expect(response).toHaveProperty('date')
    expect(response.employee).toHaveProperty('id')
    expect(response.employee).toHaveProperty('name')
    expect(response.employee).toHaveProperty('password')
    expect(response.employee).toHaveProperty('department')
    expect(response.employee).toHaveProperty('email')
    expect(response.employee).toHaveProperty('createdat')
    expect(response.employee).toHaveProperty('isactive')
    expect(response.employee).toHaveProperty('slug')
    expect(response.employee).toHaveProperty('description')
  })

  test('it shouldnt list single comment if no jwt given', async () => {
    try {
      await commentResolvers.comment(
        {
          id: 2
        },
        { headers: { authorization: '' } }
      )
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('jwt must be provided')
    }
  })

  test('it should comment replies', async () => {
    const response = await commentResolvers.commentReplies(
      {
        id: 24
      },
      { headers: { authorization: MOCK_JWT } }
    )

    expect(Array.isArray(response)).toBe(true)

    const comment = response[0]

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
  })

  test('it should  list post comments', async () => {
    const response = await commentResolvers.postComments(
      {
        id: 7
      },
      { headers: { authorization: MOCK_JWT } }
    )

    expect(Array.isArray(response)).toBe(true)

    const comment = response[0]

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
  })
})
