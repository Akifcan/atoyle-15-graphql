"use strict";
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
const db_postgres_1 = __importDefault(require("../../lib/db/db.postgres"));
const startup_1 = __importDefault(require("../../lib/startup"));
const test_1 = require("../../test");
const user_resolver_1 = require("./user.resolver");
describe('Test the root path', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, startup_1.default)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_postgres_1.default.client.end();
    }));
    test('It should sign in when credentials are correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_resolver_1.userResolvers.signIn({
            email: 'akif@mail.com',
            password: '124'
        });
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('token');
    }));
    test('It should throw error if credentials are wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_resolver_1.userResolvers.signIn({
                email: 'akiasdfasdf@mail.com',
                password: '124'
            });
            expect(true).toBe(false);
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'This user not found');
        }
    }));
    test('It should throw error if inputs are not valid', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_resolver_1.userResolvers.signIn({
                email: 'akia',
                password: '1asdf24'
            });
            expect(true).toBe(false);
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message');
        }
    }));
    test('It should return profile props', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield user_resolver_1.userResolvers.profile({ slug: 'akif-kara' }, { headers: { authorization: test_1.MOCK_JWT } });
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('name');
        expect(response).toHaveProperty('department');
        expect(response).toHaveProperty('description');
        expect(response).toHaveProperty('email');
        expect(response).toHaveProperty('slug');
    }));
    test('It should throw error if profile does not found', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_resolver_1.userResolvers.profile({ slug: 'asdfasdfasdf' }, { headers: { authorization: test_1.MOCK_JWT } });
            expect(true).toBe(false);
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'This user not found');
        }
    }));
    test('It should throw error if no jwt provided', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_resolver_1.userResolvers.profile({ slug: 'asdfasdfasdf' }, { headers: { authorization: '' } });
            expect(true).toBe(false);
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'jwt must be provided');
        }
    }));
    test('It should throw error if jwt regex is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_resolver_1.userResolvers.profile({ slug: 'asdfasdfasdf' }, { headers: { authorization: 'fasdfasdf' } });
            expect(true).toBe(false);
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'jwt malformed');
        }
    }));
});
