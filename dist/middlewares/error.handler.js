"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.productionErrorHandler = exports.errorHandlerV2 = exports.errorHandler = void 0;
const zod_1 = require("zod");
const response_services_1 = require("../services/response.services");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
/* v1 */
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        (0, response_services_1.sendHTTPResponse)({ res, message: { error: err.errors }, statusCode: 422, success: false });
        return;
    }
    (0, response_services_1.sendHTTPResponse)({ res, message: { error: err.message ?? 'Server Internal Error' }, statusCode: err.code ?? 500, success: err.success ?? false });
};
exports.errorHandler = errorHandler;
/* v2 */
const errorHandlerV2 = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        return (0, response_services_1.sendHTTPErrorResponse)({ res, error: err.errors, statusCode: 422, success: false });
    }
    if (err instanceof CustomError_1.default) {
        return (0, response_services_1.sendHTTPErrorResponse)({ res, error: err.message || 'Server Internal Error', statusCode: err.code ?? 500, success: false });
    }
    if (err instanceof Error) {
        return (0, response_services_1.sendHTTPErrorResponse)({ res, error: err.message || 'Server Internal Error', statusCode: 500, success: false });
    }
    return (0, response_services_1.sendHTTPErrorResponse)({ res, error: 'Server Internal Error', statusCode: 500, success: false });
};
exports.errorHandlerV2 = errorHandlerV2;
const productionErrorHandler = (err, req, res, next) => {
    (0, response_services_1.sendHTTPResponse)({ res, message: { error: err.message ?? 'Server Internal Error' }, statusCode: 500, success: false });
};
exports.productionErrorHandler = productionErrorHandler;
// Not Found Error Handler
// If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
const notFound = (req, res, next) => {
    (0, response_services_1.sendHTTPResponse)({ res, message: { message: 'Url doesn\'t exits' }, statusCode: 404, success: false });
};
exports.notFound = notFound;
//# sourceMappingURL=error.handler.js.map