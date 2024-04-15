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
exports.isUserLoggedInStatus = exports.deleteProfilePicture = exports.uploadProfilePicture = exports.editProfile = exports.showProfile = exports.myAddress = exports.deleteAddress = exports.editAddress = exports.addAddress = exports.changePassword = exports.resetPassword = exports.verifyForgotPassword = exports.forgotPassword = exports.logoutUser = exports.readUser = exports.loginUser = exports.verifyMailLink = exports.registerUser = void 0;
const image_helper_1 = require("../utils/image.helper");
const email_services_1 = __importDefault(require("../services/email.services"));
const Email_1 = __importDefault(require("../utils/Email"));
const jwt_services_1 = __importDefault(require("@services/jwt.services"));
const response_services_1 = require("../services/response.services");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const email_helper_utils_1 = require("../utils/email.helper.utils"); // uncomment in production
const ImageProcessing_repository_1 = __importDefault(require("../repository/ImageProcessing.repository"));
const Jwt_utils_1 = __importStar(require("../utils/Jwt.utils"));
const image_processing_services_1 = require("../services/image.processing.services");
const http_status_codes_1 = require("http-status-codes");
const user_helper_1 = require("../utils/user.helper");
const Logger_1 = __importDefault(require("@utils/LoggerFactory/Logger"));
const user_repository_1 = __importDefault(require("@repositories/user.repository"));
const user_services_1 = __importDefault(require("@services/user.services"));
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default();
const userRespository = new user_repository_1.default();
const userService = new user_services_1.default();
/**
 * Validates the request is made by human or bot
 *
 * @param {string} token
 * @returns {boolean}
 */
const checkIsHuman = async (token) => {
    //  Request headers
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    // Fetch API options
    const requestOptions = {
        method: 'POST',
        headers,
    };
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    try {
        const result = await fetch(url, requestOptions);
        const data = await result.json();
        return data.success;
    }
    catch (error) {
        return false;
    }
};
/**
 * User Register Controller
 *
 * Registers a new user with the provided fullname, email and password.
 * Sends a confirmation email to the user's registered email address
 */
const registerUser = async (req, res, next) => {
    try {
        Logger_1.default.info('Registration controller initiated', { email: req.body.email });
        const { email, recaptchaToken } = req.body;
        if (process.env.NODE_ENV === 'production' && recaptchaToken) {
            Logger_1.default.info('reCaptcha validation started', { email });
            const human = await checkIsHuman(recaptchaToken);
            Logger_1.default.info('Validating reCaptcha response', { email });
            if ((!human)) {
                Logger_1.default.error('User is not valid', req.socket.remoteAddress);
                Logger_1.default.error('User registration failed. Please try again later.', { email });
                next(new CustomError_1.default('User registration failed. Please try again later.', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
                return;
            }
            Logger_1.default.info('reCaptcha validation successfull', { email });
        }
        Logger_1.default.info('Checking database with given email', { email });
        const findUser = await userService.findUser(userRespository, { email });
        Logger_1.default.info('Validating user initiated', { email });
        if ((findUser != null) && findUser.emailVerified) {
            Logger_1.default.error(`User email: ${email} already registered, returning error response to client`);
            next(new CustomError_1.default('Invalid Email or Password', 409, false));
            return;
        }
        if ((findUser != null) && !findUser.emailVerified) {
            Logger_1.default.info(`User email: ${email} not verified. Deleting user record.`, { email });
            await userService.findUserAndDelete(userRespository, { email });
            Logger_1.default.info(`User email: ${email} deleted successfully`, { email });
        }
        const { fullname, password } = req.body;
        const userData = { fullname, email, password };
        Logger_1.default.info(`Writing user email:${email} to database started`, { email });
        const user = await userService.createUser(userRespository, userData);
        Logger_1.default.info(`Writing user email:${email} to database successfull`, { email });
        const payload = {
            email,
            id: user._id
        };
        const jwtConfig = {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.VERIFICATION_LINK_EXPIRY_DEV
        };
        const jwt = new Jwt_utils_1.default();
        Logger_1.default.info('Creating Jwt token initiated', { email });
        const token = new jwt_services_1.default().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn);
        Logger_1.default.info('Token generation successfull', { email });
        const link = (0, email_helper_utils_1.clientUrl)(`confirm?token=${token}`);
        const emailFields = {
            EmailAddress: user.email,
            FirstName: fullname,
            ConfirmationLink: link
        };
        if (process.env.NODE_ENV === 'production') {
            Logger_1.default.info(`Mail service initiated`);
            const mail = new Email_1.default(process.env.COURIER__TEST_KEY, emailFields);
            await new email_services_1.default().send_mail(mail, process.env.COURIER_CONFIRMATION_TEMPLATE_ID);
            Logger_1.default.info('Mail delivery to email successfull', { email });
        }
        Logger_1.default.info('Sending success response back to user', { email });
        const response = {
            res,
            message: {
                message: 'An verification link has been sent to your email address'
            },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.CREATED
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        Logger_1.default.error('An error occurred', { error });
        next(error);
    }
};
exports.registerUser = registerUser;
/**
 * Email Verification Controller
 *
 * Validates the token in the query and sets email verified or not
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction}
 * @query {string} req.query.token - User token
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const verifyMailLink = async (req, res, next) => {
    try {
        Logger_1.default.info('Token verification controller received the token');
        const { token } = req.query;
        Logger_1.default.info('Loading JWT secrets');
        const jwtConfig = {
            secret: process.env.JWT_SECRET
        };
        const jwt = new Jwt_utils_1.default();
        Logger_1.default.info('Starting user token validation');
        const result = new jwt_services_1.default().verifyToken(jwt, token, jwtConfig.secret);
        if (!(0, Jwt_utils_1.isJwtValidationSuccess)(result)) {
            Logger_1.default.error('Token has been expired. sending 401 error ');
            return next(new CustomError_1.default('Verification link has been expired', http_status_codes_1.StatusCodes.FORBIDDEN, false));
        }
        Logger_1.default.info(`Token validation completed successfull`);
        const { email, id } = result.message.data;
        Logger_1.default.info(`Checking email on database `);
        const user = await userService.findUser(userRespository, { email });
        if (user === null) {
            Logger_1.default.error(`No records found in database. Sending 404 error`);
            return next(new CustomError_1.default('user not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        // Each link corresponds to a document ID of a newly registered user.
        Logger_1.default.info(`Verifying token id: ${id}`);
        if (!(id.toString() === user._id.toString())) {
            Logger_1.default.error(`Invalid token. Sending 400 error, id: ${id}`);
            return next(new CustomError_1.default('Invalid token', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
        }
        Logger_1.default.info(`Setting email verified to true, id: ${id}`);
        await userService.setEmailVerified(userRespository, user);
        Logger_1.default.info(`Setting email verified flag completed successfully, id: ${id}`);
        Logger_1.default.info(`Sending response back to user, id: ${id}`);
        const response = {
            res,
            message: { message: 'Greate! Your account has been verified!', meta: 'Now it\'s shopping time' },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.ACCEPTED
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.info(`An error occurred, message: ${errorObj.message}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.verifyMailLink = verifyMailLink;
/**
 * Login Controller
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.body.email - Registered email address of the user account
 * @param {string} req.body.password - Registered password of the user account
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const loginUser = async (req, res, next) => {
    try {
        Logger_1.default.info('Login request received');
        const { email, password, recaptchaToken } = req.body;
        if (process.env.NODE_ENV === 'production' && recaptchaToken) {
            Logger_1.default.info('reCaptcha validation started', { email });
            const human = await checkIsHuman(recaptchaToken);
            Logger_1.default.info('Validating reCaptcha response', { email });
            if ((!human)) {
                Logger_1.default.error('User is not valid', req.socket.remoteAddress);
                Logger_1.default.error('User registration failed. Please try again later.', { email });
                next(new CustomError_1.default('User registration failed. Please try again later.', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
                return;
            }
            Logger_1.default.info('reCaptcha validation successfull', { email });
        }
        Logger_1.default.info('Checking user database');
        const user = await userService.findUser(userRespository, { email }, true);
        if (user === null) {
            Logger_1.default.error('Not records found. Sending 400 error');
            return next(new CustomError_1.default('Invalid email or password ', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
        }
        Logger_1.default.info(`User records found, id: ${user._id}`);
        Logger_1.default.info(`Verifying password, id: ${user._id}`);
        const isVerified = await userService.verifyPassword(userRespository, user, password);
        if (!isVerified) {
            Logger_1.default.error(`Password verification failed, id: ${user._id}`);
            return next(new CustomError_1.default('Invalid email or password ', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
        }
        Logger_1.default.info(`Password verification successfull, id: ${user._id}`);
        const payload = {
            email,
            id: user._id,
            loggedIn: true,
            role: user.role
        };
        Logger_1.default.info(`Configuring access token, id: ${user._id}`);
        const accessOptions = {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRTY_DEV
        };
        Logger_1.default.info(`Configuring refresh token, id: ${user._id}`);
        const refresOptions = {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.REFRESH_TOKEN_EXPIRTY_DEV
        };
        const jwt = new Jwt_utils_1.default();
        Logger_1.default.info(`Generating access token, id: ${user._id}`);
        const accessToken = new jwt_services_1.default().signPayload(jwt, payload, accessOptions.secret, accessOptions.expiresIn);
        Logger_1.default.info(`Generating refresh token, id: ${user._id}`);
        const refreshToken = new jwt_services_1.default().signPayload(jwt, payload, refresOptions.secret, refresOptions.expiresIn);
        Logger_1.default.info(`Setting cookie expiry, id: ${user._id}`);
        const time = parseInt(process.env.COOKIE_DEV_EXPIRY_TIME);
        const userDetails = (0, user_helper_1.responseFilter)(user.toObject());
        cache.set(`${user._id}`, userDetails, 5);
        const cookieConfig = {
            res,
            token: accessToken,
            message: {
                refreshToken,
                userDetails,
            },
            statusCode: 200,
            cookie: {
                expires: time
            },
            success: true,
        };
        Logger_1.default.info(`Sending success response, id: ${user._id}`);
        (0, response_services_1.sendHTTPWithTokenResponse)(cookieConfig);
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.error(`Login Controller error. Message: ${errorObj.message}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.loginUser = loginUser;
//Cache Aside
const readUser = async (req, res, next) => {
    try {
        let user;
        if (cache.get(req.user.id)) {
            user = cache.get(req.user.id);
        }
        else {
            const userDetails = await userService.findUser(userRespository, { _id: req.user.id });
            user = (0, user_helper_1.userFilter)(userDetails?.toObject());
            cache.set(req.user.id, user);
        }
        const response = {
            res,
            message: { user, authenticated: true },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.error(`Login Controller error. Message: ${errorObj.message}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.readUser = readUser;
/**
 * logout Controller
 *
 * The controller will clear the access token and refresh token in cookies and delete the sessions
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const logoutUser = async (req, res, next) => {
    try {
        const time = 0;
        Logger_1.default.info(`Logout request received, id: ${req.user.id}`);
        Logger_1.default.info(`Session clearing started, id: ${req.user.id}`);
        req?.session?.destroy((_err) => { console.log('session cleared'); });
        Logger_1.default.info(`Session cleared successfully, id: ${req.user.id}`);
        Logger_1.default.info(`Configuring cookie fields, id: ${req.user.id}`);
        cache.del(req.user.id);
        const cookieConfig = {
            res,
            token: null,
            message: {
                message: 'Logout Succesfully',
                refreshToken: null
            },
            cookie: {
                expires: time
            },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        Logger_1.default.info(`Sending success response, id: ${req.user.id}`);
        (0, response_services_1.sendHTTPWithTokenResponse)(cookieConfig);
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.info(`Logout Controller error. Message: ${errorObj.message}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.logoutUser = logoutUser;
/**
 * Forgot Password Controller
 *
 * Sends an verification link to the submitted email id
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.body.email
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const forgotPassword = async (req, res, next) => {
    try {
        const { email, recaptchaToken } = req.body;
        if (process.env.NODE_ENV === 'production' && recaptchaToken) {
            Logger_1.default.info('reCaptcha validation started', { email });
            const human = await checkIsHuman(recaptchaToken);
            Logger_1.default.info('Validating reCaptcha response', { email });
            if ((!human)) {
                Logger_1.default.error('User is not valid', req.socket.remoteAddress);
                Logger_1.default.error('User registration failed. Please try again later.', { email });
                next(new CustomError_1.default('User registration failed. Please try again later.', http_status_codes_1.StatusCodes.BAD_REQUEST, false));
                return;
            }
            Logger_1.default.info('reCaptcha validation successfull', { email });
        }
        const user = await userService.addForgotPasswordTokenID(userRespository, { email });
        if (user == null) {
            next(new CustomError_1.default('Not Found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const payload = {
            email,
            id: user.forgotPasswordTokenId
        };
        const jwtConfig = {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRY
        };
        const jwt = new Jwt_utils_1.default();
        const token = new jwt_services_1.default().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn);
        // const urlConfig: LinkType = {
        //   host: 'localhost',
        //   port: process.env.PORT_DEV as string,
        //   version: 'v1',
        //   route: 'users',
        //   path: `forgot/verify?token=${token}`
        // }
        // const link = clientUrl(`forgotConfirm?forgotToken=${token}`)
        // const link = generateUrl(token, urlConfig)
        const link = `http://localhost:4000/api/v1/users/forgot/verify?token=${token}`;
        const emailFields = {
            EmailAddress: user.email,
            FirstName: user.username,
            ConfirmationLink: link
        };
        if (process.env.NODE_ENV === 'production') {
            // Will uncomment in production
            const mail = new Email_1.default(process.env.COURIER__TEST_KEY, emailFields);
            // Will uncomment in production
            const RequestId = await new email_services_1.default().send_mail(mail, 'N6Q2M0HNYY47ADP5DT5C1ECTGY4A');
        }
        const response = {
            res,
            message: { message: 'An email verification link has been send to your email account.' },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.forgotPassword = forgotPassword;
/**
 * Forgot password token validation controller
 *
 * Validates token from query
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.body.email
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const verifyForgotPassword = async (req, res, next) => {
    try {
        const { token } = req.query;
        const jwtConfig = {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRY
        };
        const jwt = new Jwt_utils_1.default();
        const result = new jwt_services_1.default().verifyToken(jwt, token, jwtConfig.secret);
        if (!(0, Jwt_utils_1.isJwtValidationSuccess)(result)) {
            res.redirect(`${process.env.CLIENT_URL}expired`);
            return;
        }
        const { id, email } = result.message?.data;
        const user = await userService.findUser(userRespository, { email }, true);
        if (user === null) {
            next(new CustomError_1.default('User Not Found ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        if (user.forgotPasswordTokenId !== id) {
            res.redirect(`${process.env.CLIENT_URL}expired`);
            return;
        }
        const isToken = await userService.getResetFormToken(userRespository, email);
        if (!isToken) {
            next(new CustomError_1.default('Reset from Token creation failed', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
            return;
        }
        user.forgotPasswordTokenId = '';
        user.forgotPasswordTokenExpiry = '';
        await user.save({ validateBeforeSave: false });
        const response = {
            res,
            message: { message: 'Token verified' },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.ACCEPTED
        };
        const userDetails = await userService.addForgotPasswordTokenID(userRespository, { email });
        const payload = {
            email,
            id: userDetails?.forgotPasswordTokenId
        };
        const resetFormToken = new jwt_services_1.default().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn);
        res.redirect(process.env.FRONTEND_RESET_PASSWORD_URL + '?token=' + resetFormToken);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.verifyForgotPassword = verifyForgotPassword;
/**
 * Reset Password Controller
 * Resets the password
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.body.password
 * @param {string} req.body.token - The token used to authenticate the user's Request
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
 */
const resetPassword = async (req, res, next) => {
    try {
        const { password, token } = req.body;
        const jwtConfig = {
            secret: process.env.JWT_SECRET
        };
        const jwt = new Jwt_utils_1.default();
        const result = new jwt_services_1.default().verifyToken(jwt, token, jwtConfig.secret);
        if (!(0, Jwt_utils_1.isJwtValidationSuccess)(result)) {
            return next(new CustomError_1.default('Verification link has been expired', http_status_codes_1.StatusCodes.FORBIDDEN, false));
        }
        const { id, email } = result.message.data;
        const user = await userService.findUser(userRespository, { email });
        if (user === null) {
            next(new CustomError_1.default('User Not Found ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        if (user.forgotPasswordTokenId !== id) {
            return next(new CustomError_1.default('Verification link has been expired', http_status_codes_1.StatusCodes.FORBIDDEN, false));
        }
        user.password = password;
        user.directModifiedPaths();
        await user.save();
        const response = {
            res,
            message: { message: 'Password changed successfully' },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.resetPassword = resetPassword;
/**
 * Updates new password
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.body.email
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const changePassword = (req, res, next) => {
    void (async () => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!req.user)
                return;
            const id = req.user.id;
            const user = await userService.updatePassword(userRespository, { id, currentPassword, newPassword });
            if (user === null) {
                next(new CustomError_1.default('Password update failed', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
                return;
            }
            if (typeof user === 'boolean' && !user) {
                next(new CustomError_1.default('Incorrect password', http_status_codes_1.StatusCodes.FORBIDDEN, false));
                return;
            }
            const response = {
                res,
                message: { message: 'Password updated successfully' },
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK
            };
            (0, response_services_1.sendHTTPResponse)(response);
        }
        catch (error) {
            const errorObj = error;
            next(new CustomError_1.default(errorObj.message, errorObj.code, false));
        }
    })();
};
exports.changePassword = changePassword;
/**
 * Add Address Controller
 *
 * This controller is used to add user address
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} NextFunction
 * @param {string} req.body.address - Input address
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const addAddress = async (req, res, next) => {
    try {
        const address = { ...req.body };
        if (!req.user)
            return;
        const { id, email } = req.user;
        const user = await userService.addAddress(userRespository, { id, address });
        if (user === null) {
            next(new CustomError_1.default('Address update failed', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(user.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.addAddress = addAddress;
/**
 * Update the selected user address in user profile if exists
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next -  Callback
 * @param {Object} req.body.address - New addressx Object
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
 */
const editAddress = async (req, res, next) => {
    try {
        const address = req.body;
        const addressId = req.params.id;
        if (!req.user)
            return;
        const { id, email } = req.user;
        const isUpdated = await userService
            .updateAddress(userRespository, { address, userId: id, addressId });
        if (isUpdated === null) {
            next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const response = {
            res,
            message: { address: isUpdated },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.editAddress = editAddress;
/**
 * Delete Address Controller
 *
 * Delete address based on params id
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next -
 * @param {string} req.params.id - Address id
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const deleteAddress = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const addressId = req.params.id;
        const id = req.user.id;
        const ids = { addressId, userId: id };
        const user = await userService.deleteAddressById(userRespository, ids);
        if (!user) {
            next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(user.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteAddress = deleteAddress;
/**
 * Fetch user addresses
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const myAddress = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const { id, email } = req.user;
        const result = await userService.findUser(userRespository, { _id: id }, false);
        if (!result) {
            next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(result.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.myAddress = myAddress;
/**
 * Fetch user profile
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const showProfile = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const { id, email } = req.user;
        const user = await userService.findUser(userRespository, { _id: id });
        if (!user) {
            next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(user.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.showProfile = showProfile;
/**
 * Edit Profile Controller
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const editProfile = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const { id, email } = req.user;
        const user = await userService.updateUserProfile(userRespository, { ...req.body }, id);
        if (!user) {
            next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(user.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.editProfile = editProfile;
/**
 * Upload Profile Picture Controller
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.files.photo - photo to upload
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            next(new CustomError_1.default('Please provide an image', http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, false));
            return;
        }
        if (!req.user) {
            next(new CustomError_1.default('User not found in req object', http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, false));
            return;
        }
        const { id } = req.user;
        const options = {
            folder: 'ProfilePicture',
            gravity: 'faces',
            height: 150,
            width: 150,
            zoom: '0.6',
            crop: 'thumb'
        };
        const base64 = (0, image_helper_1.convertToBase64)(req);
        const ImageServiceRepository = new ImageProcessing_repository_1.default();
        const imageServices = new image_processing_services_1.ImageProcessingServices();
        const imageUrls = await imageServices.uploadImage(ImageServiceRepository, base64, options);
        const photoUrls = {
            publicId: imageUrls.public_id,
            secureUrl: imageUrls.secure_url,
            url: imageUrls.url
        };
        const user = await userService.updateImageUrl(userRespository, photoUrls, id);
        if (!user) {
            next(new CustomError_1.default('User not found while updating the image url', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(user.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
/**
 * Delete profile Picture
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
const deleteProfilePicture = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const { id } = req.user;
        const user = await userService.deleteProfilePicture(userRespository, id);
        if (!user) {
            next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
            return;
        }
        const response = {
            res,
            message: { user: (0, user_helper_1.responseFilter)(user.toObject()) },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteProfilePicture = deleteProfilePicture;
const isUserLoggedInStatus = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return next(new CustomError_1.default('loggedOut', http_status_codes_1.StatusCodes.UNAUTHORIZED, false));
        }
        const response = {
            res,
            message: { user: 'loggedIn' },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        return (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.isUserLoggedInStatus = isUserLoggedInStatus;
//# sourceMappingURL=userController.js.map