"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_service_1 = __importDefault(require("../config/config.service"));
const signJwt = (record) => {
    return jsonwebtoken_1.default.sign(record, config_service_1.default.jwt.secret);
};
exports.signJwt = signJwt;
const decodeJwt = (token) => {
    return jsonwebtoken_1.default.verify(token, config_service_1.default.jwt.secret);
};
exports.decodeJwt = decodeJwt;
