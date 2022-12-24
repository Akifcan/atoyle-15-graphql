"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentResolvers = void 0;
const helpers_1 = require("../../lib/helpers");
const yup = __importStar(require("yup"));
const db_postgres_1 = __importDefault(require("../../lib/db/db.postgres"));
const comment_transformer_1 = require("./comment.transformer");
exports.commentResolvers = {
    comment: (props, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = props;
        (0, helpers_1.authGuard)(context.headers.authorization);
        const comment = yield db_postgres_1.default.client.query('SELECT * FROM comment INNER JOIN employee ON comment.employeeid = employee.id WHERE comment.id = $1', [id]);
        if (comment.rows.length === 0) {
            throw new Error('This comment not found');
        }
        return (0, comment_transformer_1.commentToPublicEntity)(comment.rows[0]);
    }),
    createComment: (props, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { comment: { postid, commentid, content } } = props;
        const currentUser = (0, helpers_1.authGuard)(context.headers.authorization);
        if (postid !== undefined && commentid !== undefined) {
            throw new Error('You can only create comment for post or comment not both');
        }
        const schema = yup.object().shape({
            content: yup.string().required().max(280)
        });
        schema.validateSync({ content });
        const query = yield db_postgres_1.default.client.query(`
        INSERT INTO comment (employeeid, postid, commentid, content) VALUES ($1, $2, $3, $4) RETURNING id;
      `, [currentUser.id, postid, commentid, content]);
        const { id } = query.rows[0];
        const comment = yield db_postgres_1.default.client.query('SELECT * FROM comment INNER JOIN employee ON comment.employeeid = employee.id WHERE comment.id = $1', [id]);
        return (0, comment_transformer_1.commentToPublicEntity)(comment.rows[0]);
    })
};
