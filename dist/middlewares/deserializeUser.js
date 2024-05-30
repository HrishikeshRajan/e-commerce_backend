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
const Jwt_utils_1 = __importStar(require("../utils/Jwt.utils"));
const jwt_services_1 = __importDefault(require("../services/jwt.services"));
const response_services_1 = require("../services/response.services");
const Logger_1 = __importDefault(require("@utils/LoggerFactory/Logger"));
const JWT = new Jwt_utils_1.default();
const jwtService = new jwt_services_1.default();
const deserializeUser = (req, res, next) => {
    Logger_1.default.info('Checking Access token in request cookie');
    if (req.cookies.token && req.cookies.refreshToken) {
        const accessToken = jwtService.verifyToken(JWT, req.cookies.token, process.env.JWT_SECRET);
        if ((0, Jwt_utils_1.isJwtValidationSuccess)(accessToken)) {
            /**
             * If token valid then just pass to next middleware
             */
            Logger_1.default.info('Access token is valid. Proceeding to next middleware.');
            return next();
        }
        else {
            Logger_1.default.info('Access token invalid. Validating refresh token.');
            /**
             * Check refresh token is valid. If valid then create new access token as assign to cookie
             * else clear both cookies
             */
            const refreshToken = jwtService.verifyToken(JWT, req.cookies?.refreshToken, process.env.JWT_SECRET);
            if ((0, Jwt_utils_1.isJwtValidationSuccess)(refreshToken)) {
                const { email, id, loggedIn, role } = refreshToken.message.data;
                const payload = {
                    email,
                    id,
                    loggedIn,
                    role,
                };
                Logger_1.default.info('Refresh token is valid. Creating new access token and updating cookie.');
                //New access token
                const newAccessToken = new jwt_services_1.default().signPayload(JWT, payload, process.env.JWT_SECRET, process.env.ACCESS_TOKEN_EXPIRTY_DEV);
                req.cookies.token = newAccessToken;
            }
            else {
                Logger_1.default.error('Both access and refresh tokens are invalid. Clearing cookies.');
                //clear both tokens
                const time = 0;
                const cookieConfig = {
                    res,
                    token: null,
                    message: {
                        refreshToken: null
                    },
                    cookie: {
                        expires: time
                    },
                    success: true,
                    statusCode: 200
                };
                return (0, response_services_1.sendHTTPWithTokenResponse)(cookieConfig);
            }
        }
    }
    else if (!req.cookies.token && req.cookies.refreshToken) {
        Logger_1.default.info('Access Token is missing. Validating refresh token.');
        const refreshToken = jwtService.verifyToken(JWT, req.cookies?.refreshToken, process.env.JWT_SECRET);
        console.log(refreshToken);
        if ((0, Jwt_utils_1.isJwtValidationSuccess)(refreshToken)) {
            const { email, id, loggedIn, role } = refreshToken.message.data;
            const payload = {
                email,
                id,
                loggedIn,
                role,
            };
            Logger_1.default.info('Refresh token is valid. Creating new access token and updating cookie.');
            //New access token
            const newAccessToken = new jwt_services_1.default().signPayload(JWT, payload, process.env.JWT_SECRET, process.env.ACCESS_TOKEN_EXPIRTY_DEV);
            req.cookies.token = newAccessToken;
        }
        else {
            Logger_1.default.error('Both access and refresh tokens are invalid. Clearing cookies.');
            //clear both tokens
            const time = 0;
            const cookieConfig = {
                res,
                token: null,
                message: {
                    refreshToken: null
                },
                cookie: {
                    expires: time
                },
                success: true,
                statusCode: 200
            };
            return (0, response_services_1.sendHTTPWithTokenResponse)(cookieConfig);
        }
    }
    Logger_1.default.info('No token found. Proceeding to public APIs.');
    //To access public apis
    return next();
};
exports.default = deserializeUser;
//# sourceMappingURL=deserializeUser.js.map