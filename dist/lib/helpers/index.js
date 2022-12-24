"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = exports.decodeJwt = exports.signJwt = exports.RESULTS_PER_PAGE = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_service_1 = __importDefault(require("../config/config.service"));
exports.RESULTS_PER_PAGE = 5;
const signJwt = (record) => {
    return jsonwebtoken_1.default.sign(record, config_service_1.default.jwt.secret);
};
exports.signJwt = signJwt;
const decodeJwt = (token) => {
    return jsonwebtoken_1.default.verify(token, config_service_1.default.jwt.secret);
};
exports.decodeJwt = decodeJwt;
const authGuard = (token) => {
    const user = (0, exports.decodeJwt)(token);
    if (user === undefined || user === null)
        throw new Error('Please login first');
    return user;
};
exports.authGuard = authGuard;
