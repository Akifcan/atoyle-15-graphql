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
exports.userResolvers = void 0;
const db_postgres_1 = __importDefault(require("../../lib/db/db.postgres"));
const yup = __importStar(require("yup"));
exports.userResolvers = {
    hello: () => {
        const schema = yup.object().shape({
            content: yup.string().required().max(280)
        });
        console.log(schema.validateSync({ content: '' }));
        return 'Hello world!';
    },
    demo: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield db_postgres_1.default.client.query('SELECT * FROM employee');
            console.log(users.rows);
            return 17;
        }
        catch (e) {
            console.log(e);
            throw new Error();
        }
    }),
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    signIn: (props) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = props;
        const query = yield db_postgres_1.default.client.query('SELECT * FROM employee where email = $1 AND password = $2 AND isActive = true', [email, password]);
        const schema = yup.object().shape({
            email: yup.string().email().required().max(100),
            password: yup.string().required().max(100)
        });
        schema.validateSync({ email, password });
        if (query.rows.length === 0)
            throw new Error('This user not found');
        return query.rows[0];
    })
};
