// /* eslint-disable @typescript-eslint/ban-types */

// import cartModel from '../models/cartModel'
// import { CartRepository } from '../repository/CartRepository'
// import ProductsRepository from '../repository/product.repository'
// import { sendHTTPResponse } from '../services/response.services'
// import { type IResponse } from '../types/IResponse.interfaces'
// import { Product, type CART_ITEM } from '../types/product'
// import { type PARAMS_WITH_ID, type CART_INPUT, type CART_QTY } from '../types/zod/cart.schemaTypes'
// import CustomError from '../utils/CustomError'
// import { convertToMongooseId } from '../utils/mongodb.utils'
// import { type Request, type Response, type NextFunction } from 'express'
// import ProductServices from '../services/product.services'
// import { StatusCodes, getReasonPhrase } from 'http-status-codes'
// import ProductModel from '../models/productModel'
// import { Model } from 'mongoose'

// const productRepository = new ProductsRepository(ProductModel as unknown as Model<Product>)
// const productServices = new ProductServices()
// const cartRepository = new CartRepository(cartModel)
// /**
//  * Add to Cart Controller
//  * @param {Request} req - HTTP request object
//  * @param {Response} res - HTTP response object
//  * @param {NextFunction} next - HTTP callback
//  * @returns {Promise<void>}
//  * @throws {CustomError} -  The error will send as response to client
//  */

// export const addToCart = async (
//   req: Request<{}, IResponse, CART_INPUT, {}>,
//   res: Response<IResponse>,
//   next: NextFunction):
// Promise<void> => {
//   try {
//     const product = await productServices.findProductById(productRepository, req.body.productId)
//     if (product == null) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
//     const cartItem: CART_ITEM = {
//       productId: convertToMongooseId(req.body.productId),
//       qty: req.body.qty,
//       total: 0,
//       price: req.body.price
//     }
//     const userId = req.body.userId
//     const cart = await cartRepository.addToCart({ cartItem, userId, product })

//     const response: IResponse = {
//       res,
//       message: { cart },
//       statusCode: StatusCodes.OK,
//       success: true
//     }
//     sendHTTPResponse(response)
//   } catch (error: unknown) {
//     const errorObj = error as CustomError
//     next(new CustomError(errorObj.message, errorObj.code, false))
//   }
// }
// /**
//    * Change the Cart quantity
//    * The controller will re-assign the existing qty with new qty
//    * @param {Request} req - HTTP request object
//    * @param {Response} res - HTTP response object
//    * @param {NextFunction} next - HTTP callback
//    * @returns {Promise<void>}
//    * @throws {CustomError} - The error will send as response to client
//    */
// export const changeQty = async (
//   req: Request<{}, IResponse, CART_QTY, {}>,
//   res: Response<IResponse>,
//   next: NextFunction):
// Promise<void> => {
//   try {
//     const product = await productServices.findProductById(productRepository, req.body.productId)
//     if (product === null) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }

//     const cart = await cartRepository.findCartAndChangeQty(req.body.userId, req.body.qty, product)
//     if (cart === null) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
//     const response: IResponse = { res, message: { cart }, statusCode: StatusCodes.OK, success: true }

//     sendHTTPResponse(response)
//   } catch (error: unknown) {
//     const errorObj = error as CustomError
//     next(new CustomError(errorObj.message, errorObj.code, false))
//   }
// }

// /**
//    * Fetch Cart Controller
//    * @description -
//    * This controller will fetch corresponding cart if exists.
//    *
//    * @param {Request} req - HTTP request object
//    * @param {Response} res - HTTP response object
//    * @param {NextFunction} next - HTTP callback
//    * @returns {Promise<void>} - The error will send as response to client
//    */

// export const getCart = async (
//   req: Request<PARAMS_WITH_ID, IResponse, {}, {}>,
//   res: Response<IResponse>, next: NextFunction):
// Promise<void> => {
//   try {
//     const cart = await cartRepository.findCartByCartId(req.params.id)
//     if (cart == null) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
//     const response: IResponse = { res, message: { cart }, statusCode: StatusCodes.OK, success: true }

//     sendHTTPResponse(response)
//   } catch (error: unknown) {
//     console.error(error)
//     const errorObj = error as CustomError
//     next(new CustomError(errorObj.message, errorObj.code, false))
//   }
// }
// /**
//    * Delete Cart
//    * @param {Request} req - HTTP request object
//    * @param {Response} res - HTTP response object
//    * @param {NextFunction} next - HTTP callback
//    * @returns {Promise<void>} - The error will send as response to client
//    */
// export const deleteCart = async (
//   req: Request<PARAMS_WITH_ID, IResponse, {}, {}>,
//   res: Response<IResponse>,
//   next: NextFunction):
// Promise<void> => {
//   try {
//     const cart = await cartRepository.deleteCart(req.params.id)
//     if (cart === null) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
//     const response: IResponse = { res, message: { cart }, statusCode: StatusCodes.OK, success: true }

//     sendHTTPResponse(response)
//   } catch (error: unknown) {
//     console.error(error)
//     const errorObj = error as CustomError
//     next(new CustomError(errorObj.message, errorObj.code, false))
//   }
// }
