"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHTTPWithTokenResponse = exports.sendHTTPErrorResponse = exports.sendHTTPResponse = void 0;
/**
 *
 * @param res {Response}
 * @param message {string}
 * @param statusCode {number}
 * @param success {boolean}
 * @returns {void}
 */
const sendHTTPResponse = ({ res, message, statusCode, success }) => {
    res.status(statusCode).json({
        success,
        statusCode,
        message
    });
};
exports.sendHTTPResponse = sendHTTPResponse;
/*
* @param res {Response}
* @param message {string}
* @param statusCode {number}
* @param success {boolean}
* @returns {void}
*/
const sendHTTPErrorResponse = ({ res, error, statusCode, success = false }) => {
    res.status(statusCode).json({
        success,
        statusCode,
        error
    });
};
exports.sendHTTPErrorResponse = sendHTTPErrorResponse;
/**
 *
 * @param res {Response}
 * @param message {string}
 * @param statusCode {number}
 * @param success {boolean}
 * @param token {string}
 * @param cookie {Object}
 * @returns {void}
 */
const sendHTTPWithTokenResponse = ({ res, message, statusCode, success, token, cookie }) => {
    const expiresIn = parseInt(cookie?.expires);
    // 23 hrs
    // set secure:true for production
    const expiryTime = new Date(Date.now() + expiresIn);
    const options = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true,
        // sameSite:'none'
    };
    const accessOptions = {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true,
        // sameSite:'none'
    };
    if (expiresIn === 0) {
        res.clearCookie('connect.sid', {
            path: '/'
        });
        res.clearCookie('token', {
            path: '/'
        });
        res.clearCookie('refreshToken', {
            path: '/'
        });
        res.status(statusCode).json({
            success,
            statusCode,
            message
        });
        return;
    }
    res.cookie('refreshToken', message?.refreshToken, accessOptions);
    res.status(statusCode).cookie('token', token, options).json({
        success,
        statusCode,
        message
    });
};
exports.sendHTTPWithTokenResponse = sendHTTPWithTokenResponse;
//# sourceMappingURL=response.services.js.map