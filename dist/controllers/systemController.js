"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthBackground = exports.addAuthBackground = void 0;
const response_services_1 = require("@services/response.services");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const http_status_codes_1 = require("http-status-codes");
const addAuthBackground = async (req, res, next) => {
    try {
        const authBackground = {
            authBackgroundImage: {
                url: {
                    big: '',
                    small: ''
                }
            }
        };
        const response = { res, message: { authBackground }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.addAuthBackground = addAuthBackground;
const getAuthBackground = async (req, res, next) => {
    try {
        const authBackground = {
            authBackgroundImage: {
                url: {
                    big: '',
                    small: ''
                }
            }
        };
        const response = { res, message: { authBackground }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getAuthBackground = getAuthBackground;
//# sourceMappingURL=systemController.js.map