"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    code;
    success;
    constructor(message, code, success) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.success = success;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = CustomError;
//# sourceMappingURL=CustomError.js.map