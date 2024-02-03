//  Order controllers

import { type Request, type Response, type NextFunction } from 'express'
import { type IResponse } from '../types/IResponse.interfaces'
import { OrderManagement } from '../repository/Order'
import { CartRepository } from '../repository/CartRepository'
import cartModel from '../models/cartModell'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { sendHTTPResponse } from '../services/response.services'
import CustomError from '../utils/CustomError'
import { ORDER_STATUS } from '../models/orderModel'

const cartRepository = new CartRepository(cartModel)
const orderManagement = new OrderManagement()
// const orderDb = new OrdeDB(orderModel)

/**
 * Order Place Controller
 *
 * @param {Request} req - HTTP request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
 */
export const Checkout = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {

    interface User {
      user: {
        id: string,
        email: string
      }
    }
    const typedRequest = (req as unknown as User);
    const { id, email } = typedRequest.user;

    const cart = await cartRepository.findCartByCartId(req.params.cartId)
    if (cart === null) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

    const order = orderManagement.setProducts(cart)
      .setUserId(id)
      .setCurrencyCode(cart.currencyCode)
      .setOrderStatus(ORDER_STATUS.ACTIVE)
      .setGrandTotal(cart.subTotal)
      .setTotalQuantity(cart.totalQty)

    const response: IResponse = { res, message: { order }, statusCode: StatusCodes.OK, success: true }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
/**
   * Sets shipping address Controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export const setShippingAddress = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const order = orderManagement.setShippingAddress(req.body.address)
    const response: IResponse = { res, message: { order }, statusCode: StatusCodes.OK, success: true }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
   * Payment method select controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export const paymentMethod = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
Promise<void> => {
  try {
    const order = orderManagement.setPaymentMethod(req.body.paymentMethod).setDiscount(req.body.discount).setDiscountApplied().setSavedAmount()
    const response: IResponse = { res, message: { order }, statusCode: StatusCodes.OK, success: true }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
   * Payment Controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response<JResponse>} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export const Pay = async (req: Request, res: Response<IResponse>, next: NextFunction): Promise<void> => {
  // try {
  //   const order = new OrderRepository(orderModel)
  //   let order_id = convertToMongooseId(req.body.order_id)

  //   const paymentMethod = await stripe.paymentMethods.create({
  //     type: 'card',
  //     card: {
  //       number: '4242424242424242',
  //       exp_month: 8,
  //       exp_year: 2024,
  //       cvc: '314',
  //     },
  //     billing_details: {
  //       address: {
  //         country: 'IN',
  //       },
  //     },
  //   })

  //   const amount = (await order.getOrder({ order_id })).total_cost
  //   const stripeStrategy = new StripeStrategy(stripe)
  //   const paymentStrategy = new PaymentStrategy(amount, stripeStrategy)
  //   const paymentIntent = await paymentStrategy.pay(paymentMethod.id)

  //   await order.setOrderStatus({
  //     status: "success",
  //     order_id,
  //   })
  //   await order.setPaymentStatus({
  //     status: "success",
  //     order_id,
  //   })
  //   const result = await order.setPaymentIds({
  //     payment_id: paymentIntent.id,
  //     payment_client_id: paymentIntent.client_secret!,
  //     order_id,
  //   })

  //   sendResponse({ res, message: result, code: 200, success: true })
  // } catch (error: unknown) {
  //   console.log(error)
  //   let order_id = convertToMongooseId(req.body.order_id)
  //   const order = new OrderRepository(orderModel)
  //   await order.setOrderStatus({
  //     status: 'failed',
  //     order_id
  //   })
  //   const errorObj = error as CustomError
  //   return next(new CustomError(errorObj.message, errorObj.code, false))
  // }
  // await orderDb.createOrder(orderManagement.getOrder())
}
/**
   * Cancel Order Controller
   *
   * @param {Request<{},JResponse, ADDRESS_VALIDATE_SCHEMA,{}>} req - HTTP request object
   * @param {Response<JResponse>} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>} - A promise that resolves when the request is complete.
   */
export const cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  // try {
  //   const order = new OrderRepository(orderModel)
  //   let result = await order.setOrderStatus({
  //     status: 'canceled',
  //     order_id: convertToMongooseId(req.params.id)
  //   })
  //   sendResponse({ res, message: result, code: 201, success: true })
  // } catch (error: unknown) {
  //   const errorObj = error as CustomError
  //   return next(new CustomError(errorObj.message, errorObj.code, false))
  // }

}
