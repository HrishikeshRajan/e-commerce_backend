/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Express } from 'express'
import {
  addAddress,
  changePassword,
  deleteAddress,
  deleteProfilePicture,
  editAddress,
  editProfile,
  forgotPassword,
  loginUser,
  logoutUser,
  myAddress,
  registerUser,
  resetPassword,
  showProfile,
  uploadProfilePicture,
  verifyForgotPassword,
  verifyMailLink,
  readUser,
  isUserLoggedInStatus
} from '../controllers/userController'
import { disallowLoggedInUsers, isLoggedIn } from '../middlewares/auth'
import { multerUpload } from '../utils/image.helper'
import { rateLimit } from 'express-rate-limit'

import { ParamsSchema, ChangePasswordSchema, ForgotPasswordSchema, LoginSchema, ParamsByIdSchema, PhotoSchema, QueryWithTokenSchema, RegisterSchema, ResetPasswordSchema, UpdateProfileSchema, UserAddressSchema } from '../types/zod/user.schemaTypes'
import { validateRequest } from '../middlewares/userInputValidator'
import CustomError from '@utils/CustomError'
import logger from '@utils/LoggerFactory/Logger'
/**
 * Limits number of requests
 */
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: Number(process.env.RATE_LIMIT || '5'), 
//   standardHeaders: 'draft-7',
//   legacyHeaders: false,
//   statusCode: 429,
//   handler: (req, res, next, options) => {
//     next(new CustomError(options.message, options.statusCode, false))
//   }

// })



const router = express.Router()

// Auth API
router.route('/register')
  .post(disallowLoggedInUsers, validateRequest({ body: RegisterSchema }), registerUser)

router.route('/verify')
  .get(disallowLoggedInUsers, validateRequest({ query: QueryWithTokenSchema }), verifyMailLink)

router.route('/login')
  .post(disallowLoggedInUsers, validateRequest({ body: LoginSchema }), loginUser)

router.route('/read')
  .get(isLoggedIn, readUser)

router.route('/signout').get(isLoggedIn, logoutUser)

router.route('/forgot')
  .post(disallowLoggedInUsers, validateRequest({ body: ForgotPasswordSchema }), forgotPassword)

router.route('/forgot/verify')
  .get(disallowLoggedInUsers, verifyForgotPassword)

router.route('/forgot/reset')
  .put(disallowLoggedInUsers, validateRequest({ body: ResetPasswordSchema }), resetPassword)

router.route('/change/password')
  .put(isLoggedIn, validateRequest({ body: ChangePasswordSchema }), changePassword)

router.route('/address')
  .post(isLoggedIn, validateRequest({ body: UserAddressSchema }), addAddress)

router.route('/address/:id').put(isLoggedIn, validateRequest({ body: UserAddressSchema }), validateRequest({ params: ParamsByIdSchema }), editAddress)

router.route('/address/:id')
  .delete(isLoggedIn, validateRequest({ params: ParamsByIdSchema }), deleteAddress)

router.route('/address')
  .get(isLoggedIn, myAddress)

router.route('/profile')
  .get(isLoggedIn, showProfile)

router.route('/profile')
  .put(isLoggedIn, validateRequest({ body: UpdateProfileSchema }), editProfile)

router.route('/profile-picture')
  .put(isLoggedIn, validateRequest({ body: PhotoSchema }), multerUpload, uploadProfilePicture)

router.route('/profile-picture')
  .delete(isLoggedIn, deleteProfilePicture)


//Is loggedIn 
router.route('/authStatus')
  .get(isLoggedIn, isUserLoggedInStatus)
// token exists
router.get('/authStatus/checkToken', (req, res) => {
  logger.info('Validating request cookies')
  const token = (req.cookies) ? req.cookies.token : null
  console.log(req.cookies)
  logger.info(`cookikes: ${token}`)
  if (!token) {
    return res.status(200).json({ status: false });
  }

  return res.status(200).json({ status: true });
});
export default router
