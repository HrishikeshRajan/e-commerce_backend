import { type ICookieResponse } from '../types/Cookie.interfaces';
import { ErrorResponse, type IResponse } from '../types/IResponse.interfaces';
/**
 *
 * @param res {Response}
 * @param message {string}
 * @param statusCode {number}
 * @param success {boolean}
 * @returns {void}
 */
export declare const sendHTTPResponse: ({ res, message, statusCode, success }: IResponse) => void;
export declare const sendHTTPErrorResponse: ({ res, error, statusCode, success }: ErrorResponse) => void;
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
export declare const sendHTTPWithTokenResponse: ({ res, message, statusCode, success, token, cookie }: ICookieResponse) => void;
//# sourceMappingURL=response.services.d.ts.map