'use strict'
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {}
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]]
      }
    return t
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.commentsToPublicEntity = exports.commentToPublicEntity = void 0
const commentToPublicEntity = (record) => {
  const { id, baseid, employeeid, postid, commentid, date, string, content } =
      record,
    rest = __rest(record, [
      'id',
      'baseid',
      'employeeid',
      'postid',
      'commentid',
      'date',
      'string',
      'content'
    ])
  return {
    id: baseid,
    employeeid,
    content,
    postid,
    commentid,
    date,
    employee: Object.assign({ id: employeeid }, rest)
  }
}
exports.commentToPublicEntity = commentToPublicEntity
const commentsToPublicEntity = (rows) => {
  return rows.rows.map((comment) => (0, exports.commentToPublicEntity)(comment))
}
exports.commentsToPublicEntity = commentsToPublicEntity
