/* eslint-disable @typescript-eslint/no-misused-promises */
import express ,{Express} from 'express'
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
  verifyMailLink
} from '../controllers/userController'
import { disallowLoggedInUsers, isLoggedIn } from '../middlewares/auth'
import { multerUpload } from '../utils/image.helper'

import { ADD_TO_CART_SCHEMA, CART_QTY_SCHEMA, PARAMS_WITH_ID_SCHEMA } from '../types/zod/cart.schemaTypes'
import { VALIDATE_REQUEST } from '../utils/request.validator'
import { ParamsSchema, ChangePasswordSchema, ForgotPasswordSchema, LoginSchema, ParamsByIdSchema, PhotoSchema, QueryWithTokenSchema, RegisterSchema, ResetPasswordSchema, UpdateProfileSchema, UserAddressSchema } from '../types/zod/user.schemaTypes'
import { validateRequest } from '../middlewares/userInputValidator'


const router = express.Router()

// Auth API
router.route('/register')
  .post(disallowLoggedInUsers, validateRequest({ body: RegisterSchema }), registerUser)

router.route('/verify')
  .get(disallowLoggedInUsers, validateRequest({ query: QueryWithTokenSchema }), verifyMailLink)

router.route('/login')
  .post(disallowLoggedInUsers, validateRequest({ body: LoginSchema }), loginUser)

router.route('/signout').get(isLoggedIn, logoutUser)

router.route('/forgot')
  .post(disallowLoggedInUsers, validateRequest({ body: ForgotPasswordSchema }), forgotPassword)

router.route('/forgot/verifz')
  .get(disallowLoggedInUsers, verifyForgotPassword)

router.route('/forgot/password/:id')
  .put(disallowLoggedInUsers,validateRequest({params: ParamsSchema}) ,validateRequest({ body: ResetPasswordSchema }), resetPassword)

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

export default router
