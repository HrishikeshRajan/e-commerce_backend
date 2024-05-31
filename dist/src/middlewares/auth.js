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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disallowLoggedInUsers = exports.isLoggedIn = void 0;
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const jwt_services_1 = __importDefault(require("../services/jwt.services"));
const Jwt_utils_1 = __importStar(require("@utils/Jwt.utils"));
const lodash_1 = require("lodash");
const Logger_1 = __importDefault(require("@utils/LoggerFactory/Logger"));
/**
 * Ensures that the user is logged in for accessing the protected routes.
 *
 * @param req
 * @param res
 * @param next
 * @returns callback {next}
 *
 */
const isLoggedIn = (req, res, next) => {
    try {
        Logger_1.default.info('Validating request cookies');
        const token = (req.cookies) ? req.cookies.token : null;
        if (!(token)) {
            Logger_1.default.info('Cookies are not present');
            return next(new CustomError_1.default('Unauthorized: Access is denied due to invalid credentials', 401, false));
        }
        const jwtConfig = {
            secret: process.env.JWT_SECRET
        };
        const jwt = new Jwt_utils_1.default();
        const decodedObj = new jwt_services_1.default().verifyToken(jwt, token, jwtConfig.secret);
        if (!(0, Jwt_utils_1.isJwtValidationSuccess)(decodedObj)) {
            Logger_1.default.error('Token verification failed. Please Login');
            next(new CustomError_1.default('Please Login', 401, false));
            return;
        }
        const tokenData = { ...decodedObj.message.data };
        // Throw an error if a different user ID is provided in the parameters.
        if (req.user?._id && (req.user?._id !== tokenData.id)) {
            Logger_1.default.error('User ID mismatch in request parameters');
            return next(new CustomError_1.default('Id\'s are not matching', 401, false));
        }
        (0, lodash_1.merge)(req, { user: tokenData });
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.error(`Error in isLoggedIn middleware: ${errorObj.message} statusCode:${errorObj.code}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
        return;
    }
    next();
};
exports.isLoggedIn = isLoggedIn;
const disallowLoggedInUsers = (req, res, next) => {
    try {
        const token = req.cookies ? req.cookies.token : null;
        if (token) {
            next(new CustomError_1.default('User already loggedIn', 200, true));
            return;
        }
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, errorObj.success));
        return;
    }
    next();
};
exports.disallowLoggedInUsers = disallowLoggedInUsers;
//# sourceMappingURL=auth.js.map