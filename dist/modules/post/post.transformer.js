"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsToPublicEntity = exports.postToPublicEntity = void 0;
const postToPublicEntity = (post) => {
    const { id, employeeid, content, date } = post, rest = __rest(post, ["id", "employeeid", "content", "date"]);
    return {
        id,
        employeeid,
        content,
        date,
        employee: Object.assign({}, rest)
    };
};
exports.postToPublicEntity = postToPublicEntity;
const postsToPublicEntity = (dbRow) => {
    return dbRow.rows.map((post) => (0, exports.postToPublicEntity)(post));
};
exports.postsToPublicEntity = postsToPublicEntity;
