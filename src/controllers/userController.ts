/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'

import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { type JwtPayload } from 'jsonwebtoken'
import { type imageUrl } from '../types/cloudinary.interfaces'
import { type IEmailFields, type LinkType } from '../types/IEmail.interfaces' // uncomment in production

import { type IResponse } from '../types/IResponse.interfaces'
import { type ICookieResponse } from '../types/Cookie.interfaces'
import { convertToBase64 } from '../utils/image.helper'
// import UserRespository from '../repository/user.repository'

import EmailServices from '../services/email.services'
import Mail from '../utils/Email'

import JwtServices from '../services/jwt.services'
import { sendHTTPResponse, sendHTTPWithTokenResponse } from '../services/response.services'
// import UserServices from '../services/user.services'
import CustomError from '../utils/CustomError'
import { generateUrl } from '../utils/email.helper.utils' // uncomment in production
import Cloudinary from '../repository/ImageProcessing.repository'
import JwtRepository from '../utils/Jwt.utils'
import { ImageProcessingServices } from '../services/image.processing.services'

// import Stripe from 'stripe'
import Search from '../utils/search'
import productModel from '../models/productModel'

// import { StripeStrategy, PaymentStrategy } from '../utils/payment_strategy'
import { type AddressWithAddressId, type ForgotPassword, type Login, type Register, type ResetPassword, type QueryWithToken, type UserAddress, type ID, type UpdateProfile, type Photo } from '../types/zod/user.schemaTypes'

// eslint-disable-next-line import/no-named-default
import { default as USER } from '../exports/user'
import _ from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { type FilterQuery } from 'mongoose'
import { responseFilter } from '../utils/user.helper'

// const secret = process.env.STRIPE_PRIVATE_KEY as string
// const stripe = new Stripe(secret, {
//   apiVersion: '2022-11-15',
// })

// import { type CustomRequest } from '../types'

const { UserRepository, UserServices } = USER

const userRespository = new UserRepository()
const userService = new UserServices()

/**
 * User Register Controller
 *
 * Registers a new user with the provided fullname, email and password.
 * Sends a confirmation email to the user's registered email address
   containing a link to confirm their email address
 *
 * @param {Request} req - HTTP Request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @param {string} req.body.fullname - User fullname.
 * @param {string} req.body.email - User email address.
 * @param {string} req.body.password - User password.
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
 */
export const registerUser = async (
  req: Request<{}, IResponse, Register, {}>,
  res: Response<IResponse, {}>,
  next: NextFunction):
Promise<void> => {
  try {
    const { email } = req.body

    const findUser = await userService.findUser(userRespository, { email })
    if ((findUser != null) && findUser.emailVerified) {
      next(new CustomError('Email is already registered', 409, false)); return
    }
    if ((findUser != null) && !findUser.emailVerified) {
      await userService.findUserAndDelete(userRespository, { email })
    }

    const userData: Register = { ...req.body }

    const user = await userService.createUser(userRespository, userData)

    const payload = {
      email,
      id: user._id
    }

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.VERIFICATION_LINK_EXPIRY_DEV as string
    }

    const jwt = new JwtRepository()

    const token = new JwtServices().signPayload(jwt, payload, jwtConfig.secret, jwtConfig.expiresIn)

    const urlConfig: LinkType = {
      host: 'localhost',
      port: process.env.PORT_DEV as string,
      version: 'v1',
      route: 'users',
      path: 'register'
    }

    const link = generateUrl(token, urlConfig)

    const emailFields: IEmailFields = {
      EmailAddress: user.email,
      FirstName: user.username,
      ConfirmationLink: link
    }

    const mail: Mail = new Mail(process.env.COURIER__TEST_KEY as string, emailFields)

    await new EmailServices().send_mail(mail, process.env.COURIER_CONFIRMATION_TEMPLATE_ID as string)

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
    if (result.status === 'failure') { next(new CustomError('Verification link expired', StatusCodes.FORBIDDEN, false)); return }

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
      message: { message: 'Your account is verified' },
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

    const isVerified = await userService.verifyPassword(userRespository, user, password)

    if (!isVerified) {
      next(
        new CustomError('Email or password is incorrect', 400, false)
      ); return
    }

    const payload: JwtPayload = {
      email,
      id: user._id,
      loggedIn: true
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
    if (user == null) { next(new CustomError('If the email exists in our system, you will receive password reset instructions', StatusCodes.OK, true)); return }

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

    // const urlConfig: LinkType = {
    //   host: 'localhost',
    //   port: process.env.PORT as string,
    //   version: 'v1',
    //   route: 'user',
    //   path: 'confirm-password'
    // }

    // const link = generateUrl(token, urlConfig)

    // const emailFields: IEmailFields = {
    //   EmailAddress: user.email,
    //   FirstName: user.username,
    //   ConfirmationLink: link
    // }

    // // Will uncomment in production
    // const mail: Mail = new Mail(process.env.COURIER__TEST_KEY as string, emailFields)

    // // Will uncomment in production
    // const RequestId = await new EmailServices().send_mail(mail, process.env.COURIER_CONFIRMATION_TEMPLATE_ID as string)

    const response: IResponse = {
      res,
      message: { token },
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
  req: Request<{}, IResponse, ResetPassword, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const { password, token } = req.body

    const jwtConfig = {
      secret: process.env.JWT_SECRET as string
    }

    const jwt = new JwtRepository()

    const result: JwtPayload = new JwtServices().verifyToken(jwt, token, jwtConfig.secret)

    if (result.message.err !== null) { next(new CustomError(result.message.err, StatusCodes.BAD_REQUEST, false)); return }

    const user = await userService
      .resetPassword(userRespository, { email: result.message.data.email, password })

    if (user === null) { next(new CustomError('Invalid token', StatusCodes.BAD_REQUEST, false)); return }

    if (!(result.message.data.id.toString() === user.forgotPasswordTokenId?.toString())) {
      next(new CustomError('Invalid token', StatusCodes.UNPROCESSABLE_ENTITY, false)); return
    }

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

export const changePassword: RequestHandler = (req, res, next): void => {
  void (async () => {
    try {
      const { currentPassword, newPassword } = req.body
      const user = await userService.updatePassword(userRespository, { id: req.user ? req?.user?.id : '', currentPassword, newPassword })

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
  req: Request<{}, IResponse, UserAddress, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const address = req.body

    const user = await userService.addAddress(userRespository, { id: req.user ? req.user.id : '', address })
    if (user === null) { next(new CustomError('Address update failed', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user },
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
  req: Request<{}, IResponse, AddressWithAddressId, {}>,
  res: Response<IResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { addressId, ...address } = req.body

    const isUpdated = await userService
      .updateAddress(userRespository, { address, userId: req.user?.id, addressId })
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
  req: Request<ID, IResponse, {}, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const addressId = req.params.id
    const ids: FilterQuery<Record<string, string>> = { addressId, userId: req.user?.id }

    const address = await userService.deleteAddressByAddressId(userRespository, ids)
    if (!address) { next(new CustomError('User not found', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { address },
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
  req: Request<{}, IResponse, {}, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const id = req.user?.id as FilterQuery<string>
    const result = await userService.fetchAddressByUserId(userRespository, id)

    if (!result) { next(new CustomError('Address fetch failed', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { address: result },
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
  req: Request,
  res: Response,
  next: NextFunction):
Promise<void> => {
  try {
    const user = await userService.findUser(userRespository, { _id: req.user?.id })
    if (!user) { next(new CustomError('User not found', StatusCodes.NOT_FOUND, false)); return }

    const response: IResponse = {
      res,
      message: { user },
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
  req: Request<{}, IResponse, UpdateProfile, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const user = await userService.updateUserProfile(userRespository, { ...req.body }, req.user?.id)
    if (!user) { next(new CustomError('User not found', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user },
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
  req: Request<{}, IResponse, Photo, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    if (!req.file) { next(new CustomError('Please provide an image', StatusCodes.UNPROCESSABLE_ENTITY, false)); return }

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

    const user = await userService.updateImageUrl(userRespository, photoUrls, req.user?.id)
    if (!user) { next(new CustomError('User not found', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user },
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
  req: Request<{}, IResponse, {}, {}>,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const user = await userService.deleteProfilePicture(userRespository, req.user?.id)
    if (!user) { next(new CustomError('User not found', StatusCodes.INTERNAL_SERVER_ERROR, false)); return }

    const response: IResponse = {
      res,
      message: { user },
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
    const search = new Search(req.query, productModel.find({})).search().filter()
    let products = await search.method
    const page = parseInt(req.query.page as string)
    search.pager(page)
    products = await search.method.clone()
    sendHTTPResponse({ res, message: { products }, statusCode: StatusCodes.OK, success: true })
  } catch (error: unknown) {
    console.error(error)
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
