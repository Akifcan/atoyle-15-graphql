"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTypes = exports.postResolvers = exports.postMutations = exports.postQueries = void 0;
const post_query_1 = require("./post.query");
Object.defineProperty(exports, "postQueries", { enumerable: true, get: function () { return post_query_1.postQueries; } });
Object.defineProperty(exports, "postMutations", { enumerable: true, get: function () { return post_query_1.postMutations; } });
Object.defineProperty(exports, "postTypes", { enumerable: true, get: function () { return post_query_1.postTypes; } });
const post_resolver_1 = require("./post.resolver");
Object.defineProperty(exports, "postResolvers", { enumerable: true, get: function () { return post_resolver_1.postResolvers; } });
