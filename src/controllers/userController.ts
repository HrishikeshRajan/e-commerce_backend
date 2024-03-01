/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'

import { type Request, type Response, type NextFunction } from 'express'
import { type JwtPayload } from 'jsonwebtoken'
import { type imageUrl } from '../types/cloudinary.interfaces'
import { type IEmailFields, type LinkType } from '../types/IEmail.interfaces' // uncomment in production

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
import JwtRepository from '../utils/Jwt.utils'
import { ImageProcessingServices } from '../services/image.processing.services'

import { type AddressWithAddressId, type ForgotPassword, type Login, type ResetPassword, type QueryWithToken, type UserAddress, type ID, type UpdateProfile, type Photo, ChangePassword, Params } from '../types/zod/user.schemaTypes'

import _ from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { responseFilter } from '../utils/user.helper'

import { Token, TypedRequest, GenericRequest } from '../types/IUser.interfaces'
import logger from '@utils/LoggerFactory/DevelopmentLogger'
import UserRepository from '@repositories/user.repository'
import UserServices from '@services/user.services'

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

    const link = clientUrl(`confirm?token=${token}`)

    const emailFields: IEmailFields = {
      EmailAddress: user.email,
      FirstName: fullname,
      ConfirmationLink: link
    }

    if (process.env.NODE_ENV === 'production') {
      logger.info(`Mail service initiated`)
      const mail: Mail = new Mail(process.env.COURIER__TEST_KEY as string, emailFields)
      await new EmailServices().send_mail(mail, process.env.COURIER_CONFIRMATION_TEMPLATE_ID as string)
      logger.info('Mail delivery to email successfull', { email });
    }

    logger.info('Sending success response back to user', { email });
    const response: IResponse = {
      res,
      message: {
        message: 'An verification link has been sent to your email address'
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
 * Validates the confirm mail address link and make email address verified
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.query.token - Url that send to user registered email address
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
 */
export const verifyMailLink = async (
  req: Request<{}, IResponse, {}, QueryWithToken, {}>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const { token } = req.query

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }

    const jwt = new JwtRepository()

    const result = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)
    if (result.status === 'failure') { next(new CustomError('Verification link has been expired', StatusCodes.FORBIDDEN, false)); return }

    const { email, id } = result.message.data

    const user = await userService.findUser(userRespository, { email })

    if (user === null) { next(new CustomError('user not found', StatusCodes.NOT_FOUND, false)); return }

    // Each link corresponds to a document ID of a newly registered user.
    if (!(id.toString() === user._id.toString())) {
      next(new CustomError('Invalid token', StatusCodes.BAD_REQUEST, false)); return
    }

    await userService.setEmailVerified(userRespository, user)
    const response: IResponse = {
      res,
      message: { message: 'Greate! Your account has been verified!', meta: 'Now it\'s shopping time' },
      success: true,
      statusCode: StatusCodes.ACCEPTED
    }

    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Login Controller
 *
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next -  callback
 * @param {string} req.body.email - Registered email address of the user account
 * @param {string} req.body.password - Registered password of the user account
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
 */
export const loginUser = async (
  req: Request<{}, ICookieResponse, Login, {}>,
  res: Response<ICookieResponse, {}>,
  next: NextFunction):
  Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await userService.findUser(userRespository, { email }, true)
    if (user === null) {
      next(new CustomError('Invalid email or password ', StatusCodes.BAD_REQUEST, false)); return
    }

    const isVerified =
      await userService.verifyPassword(userRespository, user, password)

    if (!isVerified) {
      next(
        new CustomError('Invalid email or password ', StatusCodes.BAD_REQUEST, false)
      ); return
    }

    const payload: JwtPayload = {
      email,
      id: user._id,
      loggedIn: true,
      role: user.role
    }

    const accessOptions = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRTY_DEV as string
    }

    const refresOptions = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRTY_DEV as string
    }

    const jwt = new JwtRepository()

    const accessToken = new JwtServices().signPayload(jwt, payload, accessOptions.secret, accessOptions.expiresIn)
    const refreshToken = new JwtServices().signPayload(jwt, payload, refresOptions.secret, refresOptions.expiresIn)

    const time = parseInt(process.env.COOKIE_DEV_EXPIRY_TIME as string)

    const cookieConfig: ICookieResponse = {
      res,
      token: accessToken,
      message: {
        refreshToken,
        user: responseFilter(user.toObject())
      },
      cookie: {
        expires: time
      },
      success: true,
      statusCode: StatusCodes.OK
    }

    sendHTTPWithTokenResponse(cookieConfig)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * logout Controller
 *
 * The controller will clear the access token and refresh token in cookies and delete the sessions
 * to logout the user
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
 */
export const logoutUser = async (
  req: Request<{}, ICookieResponse, {}, {}>,
  res: Response<ICookieResponse, {}>,
  next: NextFunction):
  Promise<void> => {
  try {
    const time = 0

    req?.session?.destroy((_err: any) => { console.log('session cleared') })

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

    sendHTTPWithTokenResponse(cookieConfig)
  } catch (error: unknown) {
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Forgot Password Controller
 * @description - Send an verification link to the submitted email id
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.body.email - user email address
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
 */


export const forgotPassword = async (
  req: Request<{}, IResponse, ForgotPassword, {}>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const { email } = req.body

    const user = await userService.addForgotPasswordTokenID(userRespository, { email })

    if (user == null) { next(new CustomError('Not Found', StatusCodes.NOT_FOUND, false)); return }

    const payload = {
      email,
      id: user.forgotPasswordTokenId
    }
    const jwtConfig = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRY as string
    }

    const jwt = new JwtRepository()

    const token = new JwtServices().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn)

    const urlConfig: LinkType = {
      host: 'localhost',
      port: process.env.PORT_DEV as string,
      version: 'v1',
      route: 'users',
      path: 'forgot/password'
    }

    const link = generateUrl(token, urlConfig)
    const emailFields: IEmailFields = {
      EmailAddress: user.email,
      FirstName: user.username,
      ConfirmationLink: link
    }

    if (process.env.NODE_ENV === 'production') {
      // Will uncomment in production
      const mail: Mail = new Mail(process.env.COURIER__TEST_KEY as string, emailFields)

      // Will uncomment in production
      const RequestId = await new EmailServices().send_mail(mail, process.env.COURIER_CONFIRMATION_TEMPLATE_ID as string)

    }


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

export const verifyForgotPassword = async (req: Request<{}, IResponse, {}, QueryWithToken, {}>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }
    const jwt = new JwtRepository()
    const result = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)

    if (result.status === 'failure') {
      res.redirect('http://localhost:5173/expired'); return
    }

    const { id, email } = result.message?.data;
    const user = await userService.findUser(userRespository, { email }, true)
    if (user === null) {
      next(new CustomError('User Not Found ', StatusCodes.NOT_FOUND, false)); return
    }
    if (user.forgotPasswordTokenId !== id) {
      res.redirect('http://localhost:5173/expired'); return
    }

    const isToken = await userService.getResetFormToken(userRespository, email)
    if (!isToken) { next(new CustomError('Reset from Token creation failed', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    user.forgotPasswordTokenId = ''
    user.forgotPasswordTokenExpiry = ''
    await user.save({ validateBeforeSave: false })
    res.redirect(process.env.FRONTEND_RESET_PASSWORD_URL as string + '/' + isToken)

  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Reset Password Controller
 * @description -  Resets the password
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.body.password - The new password
 * @param {string} req.body.token - The token used to authenticate the user's Request
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
 */
export const resetPassword = async (
  req: GenericRequest<Params, ResetPassword, {}>,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const { password } = req.body

    const { id } = req.params

    const user = await userService.getForgotPasswordToken(userRespository, id)
    if (user === null) { next(new CustomError('Token Expired', StatusCodes.UNAUTHORIZED, false)); return }

    user.password = password
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
 * @description - This controller is used to add user address
 *
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.body.address - input address
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
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
 * @description - Update the selected user address in user profile if exists
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
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.params.id - Address id
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
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
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
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
    console.log(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * Fetch user profile
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
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
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
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
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.files.photo - photo to upload
 * @returns {Promise<void>}
 * @throws {CustomError} - The error will send as response to client
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
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
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

export const searchProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // // const search = new Search(req.query, productModel.find({})).search().filter()
    // let products = await search.method
    // const page = parseInt(req.query.page as string)
    // search.pager(page)
    // products = await search.method.clone()
    // sendHTTPResponse({ res, message: { products }, statusCode: StatusCodes.OK, success: true })
  } catch (error: unknown) {
    console.error(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
