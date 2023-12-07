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
import { addToCart, getCart, changeQty, deleteCart } from '../controllers/cartController'
import { Checkout, paymentMethod, setShippingAddress } from '../controllers/orderController'

const router = express.Router()

// Auth API
router.route('/register')
  .post(disallowLoggedInUsers, validateRequest({ body: RegisterSchema }), registerUser)

router.route('/register/url/')
  .get(disallowLoggedInUsers, validateRequest({ query: QueryWithTokenSchema }), verifyMailLink)

router.route('/login')
  .post(disallowLoggedInUsers, validateRequest({ body: LoginSchema }), loginUser)

router.route('/signout').get(isLoggedIn, logoutUser)

router.route('/forgot/password')
  .post(disallowLoggedInUsers, validateRequest({ body: ForgotPasswordSchema }), forgotPassword)
router.route('/forgot/password/url/')
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

// User Cart

router.route('/cart').post(VALIDATE_REQUEST({ body: ADD_TO_CART_SCHEMA }), addToCart)
router.route('/cart/:id').get(VALIDATE_REQUEST({ params: PARAMS_WITH_ID_SCHEMA }), getCart)
router.route('/cart').put(VALIDATE_REQUEST({ body: CART_QTY_SCHEMA }), changeQty)
router.route('/cart/:id').delete(VALIDATE_REQUEST({ params: PARAMS_WITH_ID_SCHEMA }), deleteCart)

// User Orders
router.route('/orders/:cartId').post(isLoggedIn, Checkout)
router.route('/orders/address').put(isLoggedIn, setShippingAddress)
router.route('/orders/payment').put(isLoggedIn, paymentMethod)
// router.route('/orders/address/billing').put(validateRequest({ body: AddresSchema }), setBillingAddress)
// router.route('/orders/payment').post(VALIDATE_REQUEST({ body: VALIDATE_ORDER_USER_SCHEMA }), Pay)

// router.route('/').get(searchProduct)
// router.route('/orders/status/:id').put(VALIDATE_REQUEST({ params: PARAMS_WITH_ID }), cancelOrder)
// router.route('/orders/delivery/status').put(VALIDATE_REQUEST({ body: VALIDATE_ORDER_USER_STATUS_SCHEMA }), setDelivery)
// router.route('/orders/delivery/:id').put(setRefundEligibility)
export default router
