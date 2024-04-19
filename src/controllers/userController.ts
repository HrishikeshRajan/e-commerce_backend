/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'

import { type Request, type Response, type NextFunction } from 'express'
import { type JwtPayload } from 'jsonwebtoken'
import { type imageUrl } from '../types/cloudinary.interfaces'
import { PasswordReset, type IEmailFields, type LinkType } from '../types/IEmail.interfaces' // uncomment in production

import { type IResponse } from '../types/IResponse.interfaces'
import { type ICookieResponse } from '../types/Cookie.interfaces'
import { convertToBase64 } from '../utils/image.helper'


import EmailServices from '../services/email.services'
import Mail from '../utils/Email'

import JwtServices from '@services/jwt.services'
import { sendHTTPResponse, sendHTTPWithTokenResponse } from '../services/response.services'

import CustomError from '../utils/CustomError'
import { clientForgotPasswordUrl, clientUrl, generateUrl } from '../utils/email.helper.utils' // uncomment in production
import Cloudinary from '../repository/ImageProcessing.repository'
import JwtRepository, { isJwtValidationSuccess } from '../utils/Jwt.utils'
import { ImageProcessingServices } from '../services/image.processing.services'

import { type AddressWithAddressId, type ForgotPassword, type Login, type ResetPassword, type QueryWithToken, type UserAddress, type ID, type UpdateProfile, type Photo, ChangePassword, Params } from '../types/zod/user.schemaTypes'

import _ from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { responseFilter, userFilter } from '../utils/user.helper'

import { Token, TypedRequest, GenericRequest, UserWithId, UserCore } from '../types/IUser.interfaces'
import logger from '@utils/LoggerFactory/Logger'
import UserRepository from '@repositories/user.repository'
import UserServices from '@services/user.services'
import NodeCache from 'node-cache'
const cache = new NodeCache()
const userRespository = new UserRepository()
const userService = new UserServices()

/**
 * Validates the request is made by human or bot
 * 
 * @param {string} token 
 * @returns {boolean}
 */
const checkIsHuman = async (token: string): Promise<boolean> => {
  //  Request headers
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  // Fetch API options
  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
  };

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  try {
    const result = await fetch(url, requestOptions)
    const data = await result.json()
    return data.success
  } catch (error) {
    return false
  }
}


/**
 * User Register Controller
 *
 * Registers a new user with the provided fullname, email and password.
 * Sends a confirmation email to the user's registered email address
 */
export const registerUser = async (
  req: Request,
  res: Response<IResponse, {}>,
  next: NextFunction):
  Promise<void> => {
  try {

    logger.info('Registration controller initiated', { email: req.body.email });
    const { email, recaptchaToken } = req.body


    if (process.env.NODE_ENV === 'production' && recaptchaToken) {
      logger.info('reCaptcha validation started', { email });
      const human = await checkIsHuman(recaptchaToken)
      logger.info('Validating reCaptcha response', { email });
      if ((!human)) {
        logger.error('User is not valid', req.socket.remoteAddress)
        logger.error('User registration failed. Please try again later.', { email });
        next(new CustomError('User registration failed. Please try again later.', StatusCodes.BAD_REQUEST, false)); return
      }
      logger.info('reCaptcha validation successfull', { email });
    }


    logger.info('Checking database with given email', { email });
    const findUser = await userService.findUser(userRespository, { email });
    logger.info('Validating user initiated', { email });

    if ((findUser != null) && findUser.emailVerified) {
      logger.error(`User email: ${email} already registered, returning error response to client`);
      next(new CustomError('Invalid Email or Password', 409, false)); return
    }

    if ((findUser != null) && !findUser.emailVerified) {
      logger.info(`User email: ${email} not verified. Deleting user record.`, { email });
      await userService.findUserAndDelete(userRespository, { email })
      logger.info(`User email: ${email} deleted successfully`, { email });
    }

    const { fullname, password } = req.body

    const userData = { fullname, email, password }
    logger.info(`Writing user email:${email} to database started`, { email });
    const user = await userService.createUser(userRespository, userData)
    logger.info(`Writing user email:${email} to database successfull`, { email });
    const payload = {
      email,
      id: user._id
    }

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.VERIFICATION_LINK_EXPIRY_DEV as string
    }

    const jwt = new JwtRepository()
    logger.info('Creating Jwt token initiated', { email });
    const token = new JwtServices().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn)
    logger.info('Token generation successfull', { email });

    const link = clientUrl(`/confirm?token=${token}`)

    const emailFields: IEmailFields = {
      EmailAddress: user.email,
      FirstName: fullname,
      ConfirmationLink: link
    }

    // if (process.env.NODE_ENV !== 'development') {
    logger.info(`Mail service initiated`)
    const mail: Mail = new Mail(process.env.COURIER__TEST_KEY as string, emailFields)
    const result = await new EmailServices().send_mail(mail, process.env.COURIER_CONFIRMATION_TEMPLATE_ID as string)
    console.log(result)
    logger.info('Mail delivered to email successfully', { email });
    // }

    logger.info('Sending success response back to user', { email });
    const response: IResponse = {
      res,
      message: {
        message: 'An verification link has been sent to your email address. Please wait for 10mins if you did\'t get the mail'
      },
      success: true,
      statusCode: StatusCodes.CREATED
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    logger.error('An error occurred', { error });
    next(error)
  }
}

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
export const verifyMailLink = async (
  req: Request<{}, IResponse, {}, QueryWithToken, {}>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    logger.info('Token verification controller received the token')
    const { token } = req.query

    logger.info('Loading JWT secrets')
    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }

    const jwt = new JwtRepository()

    logger.info('Starting user token validation')
    const result = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)

    if (!isJwtValidationSuccess(result)) {
      logger.error('Token has been expired. sending 401 error ')
      return next(new CustomError('Verification link has been expired', StatusCodes.FORBIDDEN, false));
    }
    logger.info(`Token validation completed successfull`)

    const { email, id } = result.message.data
    logger.info(`Checking email on database `)
    const user = await userService.findUser(userRespository, { email })

    if (user === null) {
      logger.error(`No records found in database. Sending 404 error`)
      return next(new CustomError('user not found', StatusCodes.NOT_FOUND, false));

    }

    // Each link corresponds to a document ID of a newly registered user.
    logger.info(`Verifying token id: ${id}`)
    if (!(id.toString() === user._id.toString())) {
      logger.error(`Invalid token. Sending 400 error, id: ${id}`)
      return next(new CustomError('Invalid token', StatusCodes.BAD_REQUEST, false));
    }

    logger.info(`Setting email verified to true, id: ${id}`)
    await userService.setEmailVerified(userRespository, user)
    logger.info(`Setting email verified flag completed successfully, id: ${id}`)
    logger.info(`Sending response back to user, id: ${id}`)
    const response: IResponse = {
      res,
      message: { message: 'Greate! Your account has been verified!', meta: 'Now it\'s shopping time' },
      success: true,
      statusCode: StatusCodes.ACCEPTED
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    logger.info(`An error occurred, message: ${errorObj.message}`)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const loginUser = async (
  req: Request<{}, ICookieResponse, Login, {}>,
  res: Response<ICookieResponse, {}>,
  next: NextFunction):
  Promise<void> => {
  try {
    logger.info('Login request received')
    const { email, password, recaptchaToken } = req.body

    if (process.env.NODE_ENV === 'production' && recaptchaToken) {
      logger.info('reCaptcha validation started', { email });
      const human = await checkIsHuman(recaptchaToken)
      logger.info('Validating reCaptcha response', { email });
      if ((!human)) {
        logger.error('User is not valid', req.socket.remoteAddress)
        logger.error('User registration failed. Please try again later.', { email });
        next(new CustomError('User registration failed. Please try again later.', StatusCodes.BAD_REQUEST, false)); return
      }
      logger.info('reCaptcha validation successfull', { email });
    }


    logger.info('Checking user database')
    const user = await userService.findUser(userRespository, { email }, true)
    if (user === null) {
      logger.error('Not records found. Sending 400 error')
      return next(new CustomError('Invalid email or password ', StatusCodes.BAD_REQUEST, false));
    }
    logger.info(`User records found, id: ${user._id}`)
    logger.info(`Verifying password, id: ${user._id}`)
    const isVerified =
      await userService.verifyPassword(userRespository, user, password)

    if (!isVerified) {
      logger.error(`Password verification failed, id: ${user._id}`)
      return next(
        new CustomError('Invalid email or password ', StatusCodes.BAD_REQUEST, false)
      );
    }

    logger.info(`Password verification successfull, id: ${user._id}`)
    const payload: JwtPayload = {
      email,
      id: user._id,
      loggedIn: true,
      role: user.role
    }
    logger.info(`Configuring access token, id: ${user._id}`)
    const accessOptions = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRTY_DEV as string
    }

    logger.info(`Configuring refresh token, id: ${user._id}`)
    const refresOptions = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRTY_DEV as string
    }

    const jwt = new JwtRepository()
    logger.info(`Generating access token, id: ${user._id}`)

    const accessToken = new JwtServices().signPayload(jwt, payload, accessOptions.secret, accessOptions.expiresIn)
    logger.info(`Generating refresh token, id: ${user._id}`)
    const refreshToken = new JwtServices().signPayload(jwt, payload, refresOptions.secret, refresOptions.expiresIn)

    logger.info(`Setting cookie expiry, id: ${user._id}`)
    const time = parseInt(process.env.COOKIE_DEV_EXPIRY_TIME as string)

    const userDetails = responseFilter(user.toObject())
    cache.set(`${user._id}`, userDetails, 5)
    const cookieConfig: ICookieResponse = {
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
    }
    logger.info(`Sending success response, id: ${user._id}`)
    sendHTTPWithTokenResponse(cookieConfig)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    logger.error(`Login Controller error. Message: ${errorObj.message}`)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

//Cache Aside
export const readUser = async (
  req: Request<{}, {}, Login, {}>,
  res: Response<{}, {}>,
  next: NextFunction):
  Promise<void> => {
  try {

    let user: UserCore;
    if (cache.get(req.user.id)) {
      user = cache.get(req.user.id)!
    } else {
      const userDetails = await userService.findUser(userRespository, { _id: req.user.id })
      user = userFilter(userDetails?.toObject()!)
      cache.set(req.user.id, user)
    }
    const response: IResponse = {
      res,
      message: { user, authenticated: true },
      success: true,
      statusCode: StatusCodes.OK
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    logger.error(`Login Controller error. Message: ${errorObj.message}`)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const logoutUser = async (
  req: Request<{}, ICookieResponse, {}, {}>,
  res: Response<ICookieResponse, {}>,
  next: NextFunction):
  Promise<void> => {
  try {
    const time = 0
    logger.info(`Logout request received, id: ${req.user.id}`)
    logger.info(`Session clearing started, id: ${req.user.id}`)
    req?.session?.destroy((_err: any) => { console.log('session cleared') })
    logger.info(`Session cleared successfully, id: ${req.user.id}`)

    logger.info(`Configuring cookie fields, id: ${req.user.id}`)
    cache.del(req.user.id)
    const cookieConfig: ICookieResponse = {
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
      statusCode: StatusCodes.OK
    }
    logger.info(`Sending success response, id: ${req.user.id}`)
    sendHTTPWithTokenResponse(cookieConfig)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    logger.info(`Logout Controller error. Message: ${errorObj.message}`)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const forgotPassword = async (
  req: Request<{}, IResponse, ForgotPassword, {}>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const { email, recaptchaToken } = req.body
    logger.info('forgot token request initiated')
    if (process.env.NODE_ENV === 'production' && recaptchaToken) {
      logger.info('reCaptcha validation started', { email });
      const human = await checkIsHuman(recaptchaToken)
      logger.info('Validating reCaptcha response', { email });
      if ((!human)) {
        logger.error('User is not valid', req.socket.remoteAddress)
        logger.error('User registration failed. Please try again later.', { email });
        next(new CustomError('User registration failed. Please try again later.', StatusCodes.BAD_REQUEST, false)); return
      }
      logger.info('reCaptcha validation successfull', { email });
    }


    const user = await userService.addForgotPasswordTokenID(userRespository, { email })

    if (user == null) {
      logger.error('User not found')
      next(new CustomError('Not Found', StatusCodes.NOT_FOUND, false));
      return
    }

    const payload = {
      email,
      id: user.forgotPasswordTokenId
    }
    const jwtConfig = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRY as string
    } 
    logger.info('Creating jwt token')
    const jwt = new JwtRepository()

    const token = new JwtServices().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn)
    logger.info('Jwt token created successfully')

    const link = `${process.env.ORIGIN}/api/v1/users/forgot/verify?token=${token}`
    const emailFields: IEmailFields = {
      EmailAddress: user.email,
      FirstName: user.username,
      ConfirmationLink: link
    }
    logger.info('Forgot password email link generated')


    const mail: Mail = new Mail(process.env.COURIER__TEST_KEY as string, emailFields)

    const fields: PasswordReset = {
      firstName: user.fullname,
      resetLink: link,
      companyName: 'wondercart'
    }

    const RequestId = await new EmailServices().sendPasswordResetConfirmationEmail(mail, process.env.COURIER_FORGOT_PASSWORD_EMAIL_CONFIRM_TEMPLATE_ID as string, fields)

    logger.info('Forgot password email sent successfully')
    const response: IResponse = {
      res,
      message: { message: 'An email verification link has been send to your email account.' },
      success: true,
      statusCode: StatusCodes.OK
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const verifyForgotPassword = async (req: Request<{}, IResponse, {}, QueryWithToken, {}>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query
    logger.info('Extracted token from query parameters');

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRY as string
    }
    const jwt = new JwtRepository()
    const result = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)
    if (!isJwtValidationSuccess(result)) {
      logger.error(`JWT validation failed, reason: ${result.message.err}`);
      res.redirect(`${process.env.CLIENT_URL as string}/expired`);
      return
    }

    const { id, email } = result.message?.data;
    logger.info('Decoded JWT payload successfully');

    const user = await userService.findUser(userRespository, { email }, true)
    if (user === null) {
      logger.error('User Not Found');
      next(new CustomError('User Not Found ', StatusCodes.NOT_FOUND, false));
      return
    }
    if (user.forgotPasswordTokenId !== id) {
      logger.error('Token ID mismatch');
      res.redirect(`${process.env.CLIENT_URL as string}/expired`);
      return
    }
    logger.info('User found, token ID matched');

    const isToken = await userService.getResetFormToken(userRespository, email)
    if (!isToken) {
      logger.error('Reset form token creation failed');
      next(new CustomError('Reset from Token creation failed', StatusCodes.INTERNAL_SERVER_ERROR, false));
      return
    }
    logger.info('Reset form token created successfully');
    user.forgotPasswordTokenId = ''
    user.forgotPasswordTokenExpiry = ''
    await user.save({ validateBeforeSave: false })
    logger.info('User details updated');
    const response: IResponse = {
      res,
      message: { message: 'Token verified' },
      success: true,
      statusCode: StatusCodes.ACCEPTED
    }
    const userDetails = await userService.addForgotPasswordTokenID(userRespository, { email })
    const payload = {
      email,
      id: userDetails?.forgotPasswordTokenId
    }


    const resetFormToken = new JwtServices().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn)
    logger.info('Redirecting to reset password page with token');
    res.redirect(process.env.FRONTEND_RESET_PASSWORD_URL as string + '?token=' + resetFormToken)


  } catch (error) {
    const errorObj = error as CustomError
    logger.error(`Error occurred: ${errorObj.message}`);
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const resetPassword = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const { password, token } = req.body

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }
    const jwt = new JwtRepository()
    const result = new JwtServices().verifyToken(jwt, token as string, jwtConfig.secret)

    if (!isJwtValidationSuccess(result)) {
      return next(new CustomError('Verification link has been expired', StatusCodes.FORBIDDEN, false));

    }

    const { id, email } = result.message.data;
    const user = await userService.findUser(userRespository, { email })
    if (user === null) {
      next(new CustomError('User Not Found ', StatusCodes.NOT_FOUND, false)); return
    }
    if (user.forgotPasswordTokenId !== id) {
      return next(new CustomError('Verification link has been expired', StatusCodes.FORBIDDEN, false));
    }

    user.password = password
    user.directModifiedPaths()
    await user.save()

    const response: IResponse = {
      res,
      message: { message: 'Password changed successfully' },
      success: true,
      statusCode: StatusCodes.OK
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {

    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Updates new password
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @param {string} req.body.email 
 * @returns {Promise<void>}
 * @throws {CustomError} 
 */
export const changePassword = (

  req: TypedRequest<ChangePassword, Token>,

  res: Response<IResponse>,

  next: NextFunction): void => {

  void (async () => {
    try {
      const { currentPassword, newPassword } = req.body

      if (!req.user) return
      const id = req.user.id;
      const user = await userService.updatePassword(userRespository, { id, currentPassword, newPassword })

      if (user === null) { next(new CustomError('Password update failed', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }
      if (typeof user === 'boolean' && !user) { next(new CustomError('Incorrect password', StatusCodes.FORBIDDEN, false)); return }

      const response: IResponse = {
        res,
        message: { message: 'Password updated successfully' },
        success: true,
        statusCode: StatusCodes.OK
      }
      sendHTTPResponse(response)
    } catch (error: unknown) {
      const errorObj = error as CustomError
      next(new CustomError(errorObj.message, errorObj.code, false))
    }
  })()
}

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
export const addAddress = async (
  req: TypedRequest<UserAddress, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {

    const address = { ...req.body };

    if (!req.user) return;
    const { id, email } = req.user;

    const user = await userService.addAddress(userRespository, { id, address })
    if (user === null) { next(new CustomError('Address update failed', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(user.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const editAddress = async (
  req: GenericRequest<ID, AddressWithAddressId, Token>,
  res: Response<IResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const address = req.body
    const addressId = req.params.id

    if (!req.user) return
    const { id, email } = req.user;

    const isUpdated = await userService
      .updateAddress(userRespository, { address, userId: id, addressId })
    if (isUpdated === null) { next(new CustomError('User not found', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { address: isUpdated },
      success: true,
      statusCode: StatusCodes.OK
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

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
export const deleteAddress = async (
  req: GenericRequest<ID, {}, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    if (!req.user) return

    const addressId = req.params.id
    const id = req.user.id
    const ids = { addressId, userId: id }

    const user = await userService.deleteAddressById(userRespository, ids)
    if (!user) { next(new CustomError('User not found', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(user.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Fetch user addresses
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise<void>}
 * @throws {CustomError} 
 */
export const myAddress = async (
  req: GenericRequest<{}, {}, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {


    if (!req.user) return;
    const { id, email } = req.user;

    const result = await userService.findUser(userRespository, { _id: id }, false)
    if (!result) { next(new CustomError('User not found', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(result.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Fetch user profile
 * @param {Request} req 
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 * @throws {CustomError} 
 */
export const showProfile = async (
  req: GenericRequest<{}, {}, Token>,
  res: Response,
  next: NextFunction):
  Promise<void> => {
  try {

    if (!req.user) return;
    const { id, email } = req.user;

    const user = await userService.findUser(userRespository, { _id: id })
    if (!user) { next(new CustomError('User not found', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(user.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
/**
 * Edit Profile Controller
 *
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise<void>}
 * @throws {CustomError} 
 */
export const editProfile = async (
  req: GenericRequest<{}, UpdateProfile, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {

    if (!req.user) return;
    const { id, email } = req.user;

    const user = await userService.updateUserProfile(userRespository, { ...req.body }, id)
    if (!user) { next(new CustomError('User not found', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(user.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}





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
export const uploadProfilePicture = async (
  req: GenericRequest<{}, Photo, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {

    if (!req.file) { next(new CustomError('Please provide an image', StatusCodes.UNPROCESSABLE_ENTITY, false)); return }
    if (!req.user) { next(new CustomError('User not found in req object', StatusCodes.UNPROCESSABLE_ENTITY, false)); return }

    const { id } = req.user

    const options: UploadApiOptions = {
      folder: 'ProfilePicture',
      gravity: 'faces',
      height: 150,
      width: 150,
      zoom: '0.6',
      crop: 'thumb'
    }
    const base64: string | undefined = convertToBase64(req)
    const ImageServiceRepository = new Cloudinary()
    const imageServices = new ImageProcessingServices()
    const imageUrls: UploadApiResponse = await imageServices.uploadImage(ImageServiceRepository, base64 as string, options)
    const photoUrls: imageUrl = {
      publicId: imageUrls.public_id,
      secureUrl: imageUrls.secure_url,
      url: imageUrls.url
    }

    const user = await userService.updateImageUrl(userRespository, photoUrls, id)
    if (!user) { next(new CustomError('User not found while updating the image url', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(user.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Delete profile Picture
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise<void>}
 * @throws {CustomError} 
 */
export const deleteProfilePicture = async (
  req: GenericRequest<{}, {}, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {


    if (!req.user) return
    const { id } = req.user;
    const user = await userService.deleteProfilePicture(userRespository, id)
    if (!user) { next(new CustomError('User not found', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user: responseFilter(user.toObject()) },
      success: true,
      statusCode: StatusCodes.OK
    }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

export const isUserLoggedInStatus = async (
  req: Request<{}, {}, Token>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {


    if (!req.cookies.token) {
      return next(new CustomError('loggedOut', StatusCodes.UNAUTHORIZED, false));
    }

    const response: IResponse = {
      res,
      message: { user: 'loggedIn' },
      success: true,
      statusCode: StatusCodes.OK
    }
    return sendHTTPResponse(response)

  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}