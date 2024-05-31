"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJwtValidationSuccess = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isJwtValidationSuccess = (response) => {
    return response.message.data !== undefined;
};
exports.isJwtValidationSuccess = isJwtValidationSuccess;
class JwtRepository_v2 {
    jwt;
    constructor() {
        this.jwt = jsonwebtoken_1.default;
    }
    sign(payload, SECRET, expiry) {
        const signOptions = {
            expiresIn: expiry,
            algorithm: 'HS256'
        };
        return this.jwt.sign(payload, SECRET, signOptions);
    }
    verify(token, SECRET) {
        try {
            const payload = this.jwt.verify(token, SECRET);
            return ({ status: 'success', message: { data: payload }, code: 200 });
        }
        catch (error) {
            return ({ status: 'failure', message: { err: error.message }, code: 403 });
        }
    }
    decode(payload) {
        try {
            return this.jwt.decode(payload);
        }
        catch (error) {
            return ({
                err: error,
                statusCode: 400
            });
        }
    }
}
exports.default = JwtRepository_v2;
//# sourceMappingURL=Jwt.utils.js.map