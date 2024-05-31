import { type Request, type Response, type NextFunction } from 'express';
import { type IResponse } from '../types/IResponse.interfaces';
import { type ICookieResponse } from '../types/Cookie.interfaces';
import { type AddressWithAddressId, type ForgotPassword, type Login, type QueryWithToken, type UserAddress, type ID, type UpdateProfile, type Photo, ChangePassword } from '../types/zod/user.schemaTypes';
import { Token, TypedRequest, GenericRequest } from '../types/IUser.interfaces';
/**
 * User Register Controller
 *
 * Registers a new user with the provided fullname, email and password.
 * Sends a confirmation email to the user's registered email address
 */
export declare const registerUser: (req: Request, res: Response<IResponse, {}>, next: NextFunction) => Promise<void>;
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
export declare const verifyMailLink: (req: Request<{}, IResponse, {}, QueryWithToken, {}>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
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
export declare const loginUser: (req: Request<{}, ICookieResponse, Login, {}>, res: Response<ICookieResponse, {}>, next: NextFunction) => Promise<void>;
export declare const readUser: (req: Request<{}, {}, Login, {}>, res: Response<{}, {}>, next: NextFunction) => Promise<void>;
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
export declare const logoutUser: (req: Request<{}, ICookieResponse, {}, {}>, res: Response<ICookieResponse, {}>, next: NextFunction) => Promise<void>;
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
export declare const forgotPassword: (req: Request<{}, IResponse, ForgotPassword, {}>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
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
export declare const verifyForgotPassword: (req: Request<{}, IResponse, {}, QueryWithToken, {}>, res: Response, next: NextFunction) => Promise<void>;
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
export declare const resetPassword: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Updates new password
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} req.body.email
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
export declare const changePassword: (req: TypedRequest<ChangePassword, Token>, res: Response<IResponse>, next: NextFunction) => void;
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
export declare const addAddress: (req: TypedRequest<UserAddress, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
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
export declare const editAddress: (req: GenericRequest<ID, AddressWithAddressId, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
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
export declare const deleteAddress: (req: GenericRequest<ID, {}, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Fetch user addresses
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
export declare const myAddress: (req: GenericRequest<{}, {}, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Fetch user profile
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
export declare const showProfile: (req: GenericRequest<{}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * Edit Profile Controller
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
export declare const editProfile: (req: GenericRequest<{}, UpdateProfile, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
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
export declare const uploadProfilePicture: (req: GenericRequest<{}, Photo, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Delete profile Picture
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError}
 */
export declare const deleteProfilePicture: (req: GenericRequest<{}, {}, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
export declare const isUserLoggedInStatus: (req: Request<{}, {}, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map