"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const modules_1 = require("../modules");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/graphql', 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(0, express_graphql_1.graphqlHTTP)({
    schema: modules_1.schema,
    rootValue: modules_1.rootValue,
    graphiql: {
        headerEditorEnabled: true
    }
}));
exports.default = app;
