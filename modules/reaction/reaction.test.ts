import Db from '../../lib/db/db.postgres'
import startup from '../../lib/startup'
import { MOCK_JWT } from '../../test'
import { reactionResolvers } from './reaction.resolver'

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

  test('it should react the post', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    const response = await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: MOCK_JWT } })

    expect(response.success).toBe(true)
    expect(response.text).toBe('You just reacted this post')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should react the post and revoke the react', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: MOCK_JWT } })
    const revoke = await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: MOCK_JWT } })

    expect(revoke.success).toBe(true)
    expect(revoke.text).toBe('You reaction has been revoked from this post')

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

    const response = await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: MOCK_JWT } })

    expect(response.success).toBe(true)
    expect(response.text).toBe('You just reacted this post')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should throw error if no jwt given', async () => {
    let postid

    try {
      const testPost = await Db.client.query(
        `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsftest!') RETURNING id
      `
      )
      postid = testPost.rows[0].id

      const testComment = await Db.client.query('INSERT INTO comment (employeeid, postid, content) VALUES(3, $1, $2) RETURNING id', [postid, 'testcomment!'])
      const commentid = testComment.rows[0].id

      await reactionResolvers.giveCommentReaction({ reaction: { reactionid: 1, commentid } }, { headers: { authorization: '' } })

      expect(true).toBe(false)
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe('jwt must be provided')
    } finally {
      await Db.client.query('DELETE FROM post where ID = $1', [postid])
    }
  })

  test('it should react the comment', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsftest!') RETURNING id
      `
    )
    const postid = testPost.rows[0].id

    const testComment = await Db.client.query('INSERT INTO comment (employeeid, postid, content) VALUES(3, $1, $2) RETURNING id', [postid, 'testcomment!'])
    const commentid = testComment.rows[0].id

    const react = await reactionResolvers.giveCommentReaction({ reaction: { reactionid: 1, commentid } }, { headers: { authorization: MOCK_JWT } })

    expect(react.success).toBe(true)
    expect(react.text).toBe('You just reacted this comment')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should react the comment and revoke the react', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsftest!') RETURNING id
      `
    )
    const postid = testPost.rows[0].id

    const testComment = await Db.client.query('INSERT INTO comment (employeeid, postid, content) VALUES(3, $1, $2) RETURNING id', [postid, 'testcomment!'])
    const commentid = testComment.rows[0].id

    await reactionResolvers.giveCommentReaction({ reaction: { reactionid: 1, commentid } }, { headers: { authorization: MOCK_JWT } })
    const revoke = await reactionResolvers.giveCommentReaction({ reaction: { reactionid: 1, commentid } }, { headers: { authorization: MOCK_JWT } })

    expect(revoke.success).toBe(true)
    expect(revoke.text).toBe('You reaction has been revoked from this comment')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })

  test('it should list post reactions', async () => {
    const testPost = await Db.client.query(
      `
        INSERT INTO post (employeeid, content) 
        VALUES (3, 'fsaadsf') RETURNING id
      `
    )

    const postid = testPost.rows[0].id

    // Akif reacts the post
    await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: akifToken } })
    // Deniz reacts the post
    await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: denizToken } })
    // Sebnem ferah reacts the post
    await reactionResolvers.givePostReaction({ reaction: { reactionid: 2, postid } }, { headers: { authorization: sebnemFerahToken } })

    const result = await reactionResolvers.showPostReactions({ id: postid }, { headers: { authorization: akifToken } })

    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('count')
    expect(result[0]).toHaveProperty('emoji')

    const count = result[0].count

    expect(+count).toBeGreaterThanOrEqual(1)

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

    // Akif reacts the post
    await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: akifToken } })
    // Deniz reacts the post
    await reactionResolvers.givePostReaction({ reaction: { reactionid: 1, postid } }, { headers: { authorization: denizToken } })
    // Sebnem ferah reacts the post
    await reactionResolvers.givePostReaction({ reaction: { reactionid: 2, postid } }, { headers: { authorization: sebnemFerahToken } })

    const result = await reactionResolvers.showPostReactedUsers({ id: postid }, { headers: { authorization: akifToken } })

    expect(Array.isArray(result)).toBe(true)
    const react = result[0]
    expect(react).toHaveProperty('id')
    expect(react).toHaveProperty('reactionid')
    expect(react).toHaveProperty('postid')
    expect(react).toHaveProperty('createdat')
    expect(react).toHaveProperty('type')
    expect(react.type).toHaveProperty('id')
    expect(react.type).toHaveProperty('name')
    expect(react.type).toHaveProperty('emoji')
    expect(react.type).toHaveProperty('createdat')
    expect(react).toHaveProperty('employee')
    expect(react.employee).toHaveProperty('name')
    expect(react.employee).toHaveProperty('password')
    expect(react.employee).toHaveProperty('department')
    expect(react.employee).toHaveProperty('email')
    expect(react.employee).toHaveProperty('isactive')
    expect(react.employee).toHaveProperty('slug')
    expect(react.employee).toHaveProperty('description')
    expect(react.employee).toHaveProperty('id')

    await Db.client.query('DELETE FROM post where ID = $1', [postid])
  })
})
