"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootValue = exports.schema = void 0;
const graphql_1 = require("graphql");
const user_module_1 = require("./user/user.module");
exports.schema = (0, graphql_1.buildSchema)(`
  ${user_module_1.userTypes}
  type Query {
    ${user_module_1.userQueries}
  }
  type Mutation {
    ${user_module_1.userMutations}
  }
`);
exports.rootValue = Object.assign({}, user_module_1.userResolvers);
