//  Order controllers
import dotenv from 'dotenv'
import { type Request, type Response, type NextFunction } from 'express'
import { type IResponse } from '../types/IResponse.interfaces'

import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { sendHTTPResponse } from '../services/response.services'
import CustomError from '../utils/CustomError'
import CartModel, { NumToStatusMap, ORDER_STATUS } from '@models/cartModel'
import OrderModel, { OrderCore } from '@models/orderModel'
import userModel from '@models/userModel'
import Stripe from 'stripe'
import { PipelineStage, Types } from 'mongoose'
import { SortMap } from '@utils/sort.helper'
import { getMatchPipleLine } from '@utils/pipelines.search'
import productModel from '@models/productModel'
import { ProductCore, ProductDocument } from 'types/product.interface'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string, {
  typescript: true,
  apiVersion: '2022-11-15'
})

/**
 * Create a new order
 * @param {Request} req - HTTP request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
 */
export const create = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {

    const cart = await CartModel.findById(req.params.cartId)


    if (!cart) { next(new CustomError(getReasonPhrase(StatusCodes.NOT_FOUND), StatusCodes.NOT_FOUND, false)); return }
    const orderObj: OrderCore = {
      userId: req.user.id,
      cartId: cart._id,
      orderDetails: {
        status: 'PENDING',
        fullfiled: new Date(Date.now()).toDateString()
      },
      shippingAddress: req.body.shippingAddress
    }


    const order = (await OrderModel.create(orderObj)).toObject({ flattenMaps: true })
    const orderId = order._id
    delete order._id
    delete order.__v
    //@ts-ignore
    delete order.createdAt
    //@ts-ignore
    delete order.updatedAt
    //@ts-ignore
    order['orderId'] = orderId

    const response: IResponse = { res, message: { order }, statusCode: StatusCodes.OK, success: true }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
/**
   * Sets shipping address 
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export const addShippingAddress = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const orderDoc = await OrderModel.findById(req.params.orderId)
    const user = await userModel.findById(req.user.id)
    if (!user) return

    const addresses = user.address
    const selectedAddress = addresses?.find((address) => address._id.toString() === req.params.addressId.toString())
    if (orderDoc && orderDoc.shippingAddress) {
      orderDoc.shippingAddress = { ...selectedAddress! }
    }
    orderDoc?.modifiedPaths()
    const order = await orderDoc?.save()!
    const orderId = order._id
    delete order._id
    delete order.__v
    //@ts-ignore
    delete order.createdAt
    //@ts-ignore
    delete order.updatedAt
    //@ts-ignore
    order['orderId'] = orderId

    const response: IResponse = { res, message: { order }, statusCode: StatusCodes.OK, success: true }
    sendHTTPResponse(response)
  } catch (error: unknown) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

export const getSingleOrder = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {

    const orderDoc = await OrderModel.findById(req.params.orderId).select('-__v -createdAt -updatedAt').populate('userId', 'fullname _id').populate('cartId', '-__v -_id -userId -createdAt -updatedAt')
    if (!orderDoc) return
    const order = orderDoc.toObject({ flattenMaps: true })
    const orderId = order._id
    delete order._id

    //@ts-ignore
    order['orderId'] = orderId

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
export const paymentIntent = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {

    const { paymentMethodTypes, currency, cartId, orderId } = req.body;

    const userCart = await CartModel.findById(cartId).populate('products.$*product')
    if (!userCart) return

    const paymentIntent = await stripe.paymentIntents.create({
      amount: userCart?.grandTotalPrice! * 100,
      currency: currency,
      payment_method_types: [paymentMethodTypes],
      metadata: {
        orderId: orderId,
        cartId: cartId
      },
    });


    sendHTTPResponse({ res, message: { clientSecret: paymentIntent.client_secret, id: paymentIntent.id }, statusCode: 200, success: true })

  } catch (error: unknown) {
    const errorObj = error as CustomError
    console.log('rrror', error)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}



export const StripeWebHook = async (req: Request, res: Response<IResponse>, next: NextFunction): Promise<any> => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'payment_intent.created') {
    console.log(`Payment created💸`)
    const orderId = data.object.metadata.orderId
    await OrderModel.findByIdAndUpdate(orderId, {
      $set: {
        'paymentDetails.status': 'INITIATED',
        'paymentDetails.paidAmount': Math.floor(data.object.amount_received / 100),
        'paymentDetails.paymentId': data.object.id,
      }
    })
  }

  if (eventType === 'payment_intent.succeeded') {
    const orderId = data.object.metadata.orderId
    const cartId = data.object.metadata.cartId
    await OrderModel.findByIdAndUpdate(orderId, {
      $set: { // Use $set operator to update specific fields
        'paymentDetails.status': 'SUCCESS',
        'paymentDetails.paidAmount': Math.floor(data.object.amount_received / 100),
        'paymentDetails.paymentId': data.object.id,
        'orderDetails.status': 'INITIATED',
      }
    })
    await CartModel.findByIdAndUpdate(cartId,{
      '$set':{
        'status': 'Expired'
      }
    })
    console.log('💰 Payment captured!');
  }
  else if (eventType === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed.');
    const orderId = data.object.metadata.orderId
    await OrderModel.findByIdAndUpdate(orderId, {
      $set: {
        'paymentDetails.status': 'FAILED',
        'paymentDetails.paidAmount': Math.floor(0),
        'paymentDetails.paymentId': data.object.id,
        'orderDetails.status': 'CANCELED',
      }
    })
  }
  res.sendStatus(200);
}


/**
   * Payment method select controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */


export interface CartItem {
  productId: string
  qty: number
  totalPrice: number
  options: {
    size: string
    color: string
  }
}

export interface Order {
  userId: string
  cart: {
    cartId: string
    products: { [x: string]: any }
    grandTotalPrice: number
    grandTotalQty: number
  }
  shippingAddress: any
  paymentDetails: any
  orderDetails: any
  orderedAt: string
  orderId: string
}

/**
   * List  orders
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export const List = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const userId = req.user.id;

    const userOrders = await OrderModel.aggregate([{
      '$match': {
        'userId': new Types.ObjectId(req.user.id as string)
      }
    },
    {
      '$lookup': {
        'from': 'carts',
        'localField': 'cartId',
        'foreignField': '_id',
        'as': 'cart'
      }
    }, {
      '$group': {
        '_id': {
          'orders': '$cart.products',
          'cartId': '$cartId',
          'shippingAddress': '$shippingAddress',
          'orderDate': '$createdAt',
          'paymentDetails': '$paymentDetails',
          'customerId': '$userId'
        }
      }
    }, {
      '$unwind': {
        'path': '$_id'
      }
    }, {
      '$unwind': {
        'path': '$_id.orders'
      }
    }, {
      '$addFields': {
        'orders': {
          '$map': {
            'input': {
              '$objectToArray': '$_id.orders'
            },
            'as': 'item',
            'in': {
              'k': '$$item.k',
              'v': {
                '$mergeObjects': [
                  '$$item.v', {
                    'cartId': '$_id.cartId'
                  }, {
                    'shippingAddress': '$_id.shippingAddress'
                  }, {
                    'orderDate': '$_id.orderDate'
                  }, {
                    'paymentDetails': '$_id.paymentDetails'
                  }, {
                    'customerId': '$_id.customerId'
                  }
                ]
              }
            }
          }
        }
      }
    }, {
      '$project': {
        '_id': 0
      }
    }, {
      '$project': {
        'ordersArray': {
          '$map': {
            'input': '$orders',
            'as': 'product',
            'in': {
              'productId': '$$product.k',
              'cartItem': '$$product.v'
            }
          }
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'orders': {
          '$map': {
            'input': '$ordersArray',
            'as': 'product',
            'in': '$$product.cartItem'
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$orders'
      }
    }, {
      '$lookup': {
        'from': 'products',
        'localField': 'orders.product',
        'foreignField': '_id',
        'as': 'orders.product'
      }
    }, {
      '$set': {
        'orders.product': {
          '$arrayElemAt': [
            '$orders.product', 0
          ]
        }
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'orders.customerId',
        'foreignField': '_id',
        'as': 'orders.customerId'
      }
    }, {
      '$set': {
        'orders.customerId': {
          '$arrayElemAt': [
            '$orders.customerId', 0
          ]
        }
      }
    }, {
      '$project': {
        'orders.customerId.password': 0,
        'orders.customerId.role': 0,
        'orders.customerId.emailVerified': 0,
        'orders.customerId.forgotPasswordTokenId': 0,
        'orders.customerId.forgotpasswordTokenVerfied': 0,
        'orders.customerId.forgotPasswordTokenExpiry': 0,
        'orders.customerId.isPrimeUser': 0,
        'orders.customerId.seller': 0,
        'orders.customerId.address': 0,
        'orders.customerId.unVerifiedUserExpires': 0,
        'orders.customerId.createdAt': 0,
        'orders.customerId.updatedAt': 0,
        'orders.customerId.__v': 0
      }
    }, {
      '$set': {
        'order': '$orders'
      }
    }, {
      '$set': {
        'order.product.productId': '$order.product._id',
        'order.orderId': '$order._id'
      }
    }, {
      '$project': {
        'orders': 0,
        'order.productId': 0,
        'order.product.reviews': 0,
        'order.product._id': 0,
        'order.product.__v': 0,
        'order.product.createdAt': 0,
        'order.product.updatedAt': 0,
        'order._id': 0
      }
    }, {
      '$facet': {
        'orders': [
          {
            '$skip': 0
          }, {
            '$limit': 20
          }
        ]
      }
    },
    {
      '$project': {
        'orders': '$orders.order'
      }
    },
    {
      '$sort': {
        'orderDate': -1
      }
    }
    ])

    // const userOrders = 

    if (!userOrders) return
    sendHTTPResponse({ res, message: { orders: userOrders[0].orders }, statusCode: 200, success: true })

  } catch (error: unknown) {
    const errorObj = error as CustomError
    console.log('rrror', error)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

export const myPurchases = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const userId = req.user.id;
    
    const carts = await CartModel.find({status:'Expired'}).populate({ path: 'products.$*.product' }).lean()
    let ids:string[] = []

    for(let item of carts){
       ids = [...ids, ...Object.keys(item.products)]

    }

    const products:ProductDocument[] = []
    const uniqIds = new Set<string>(ids)
    for(let id of uniqIds){

       const product = await productModel.findById(id)
       if(product){
        products.push(product)
       }
    }


    sendHTTPResponse({ res, message: { orders: products }, statusCode: 200, success: true })

  } catch (error: unknown) {
    const errorObj = error as CustomError
    console.log('rrror', error)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
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
  try {
    const userId = req.user.id;
    const cartId = req.params.cartId
    const productId = req.params.productId
    const userOrders = await CartModel.findById(cartId).populate({ path: 'products.$*.product' })

    if (!userOrders) return

    const product = userOrders.products.get(productId)!
    product.orderStatus = ORDER_STATUS.CANCELED
    userOrders.products.set(productId, product)
    const result = await userOrders.save()
    sendHTTPResponse({ res, message: { message: 'Canceled' }, statusCode: 200, success: true })

  } catch (error: unknown) {
    const errorObj = error as CustomError
    console.log('rrror', error)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }

}





/**
   * List  orders by shop
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
export const ListByShop = async (
  req: Request,
  res: Response<IResponse>,
  next: NextFunction):
  Promise<void> => {
  try {
    const resultPerPage = parseInt(req.query.resultPerPage as string, 10) || 10
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
    const skip = resultPerPage * (page - 1)



    const pipelineGeneral: PipelineStage[] = [{
      '$match': {
        'paymentDetails.status': 'SUCCESS'
      }
    },

    {
      '$lookup': {
        'from': 'carts',
        'localField': 'cartId',
        'foreignField': '_id',
        'as': 'cart'
      }
    }, {
      '$group': {
        '_id': {
          'orders': '$cart.products',
          'cartId': '$cartId',
          'shippingAddress': '$shippingAddress',
          'orderDate': '$createdAt',
          'paymentDetails': '$paymentDetails',
          'customerId': '$userId'
        }
      }
    }, {
      '$unwind': {
        'path': '$_id'
      }
    }, {
      '$unwind': {
        'path': '$_id.orders'
      }
    }, {
      '$addFields': {
        'orders': {
          '$map': {
            'input': {
              '$objectToArray': '$_id.orders'
            },
            'as': 'item',
            'in': {
              'k': '$$item.k',
              'v': {
                '$mergeObjects': [
                  '$$item.v', {
                    'cartId': '$_id.cartId'
                  }, {
                    'shippingAddress': '$_id.shippingAddress'
                  }, {
                    'orderDate': '$_id.orderDate'
                  }, {
                    'paymentDetails': '$_id.paymentDetails'
                  }, {
                    'customerId': '$_id.customerId'
                  }
                ]
              }
            }
          }
        }
      }
    }, {
      '$project': {
        '_id': 0
      }
    }, {
      '$project': {
        'ordersArray': {
          '$map': {
            'input': '$orders',
            'as': 'product',
            'in': {
              'productId': '$$product.k',
              'cartItem': '$$product.v'
            }
          }
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'orders': {
          '$map': {
            'input': '$ordersArray',
            'as': 'product',
            'in': '$$product.cartItem'
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$orders'
      }
    }, {
      '$lookup': {
        'from': 'products',
        'localField': 'orders.product',
        'foreignField': '_id',
        'as': 'orders.product'
      }
    }, {
      '$set': {
        'orders.product': {
          '$arrayElemAt': [
            '$orders.product', 0
          ]
        }
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'orders.customerId',
        'foreignField': '_id',
        'as': 'orders.customerId'
      }
    }, {
      '$set': {
        'orders.customerId': {
          '$arrayElemAt': [
            '$orders.customerId', 0
          ]
        }
      }
    }, {
      '$project': {
        'orders.customerId.password': 0,
        'orders.customerId.role': 0,
        'orders.customerId.emailVerified': 0,
        'orders.customerId.forgotPasswordTokenId': 0,
        'orders.customerId.forgotpasswordTokenVerfied': 0,
        'orders.customerId.forgotPasswordTokenExpiry': 0,
        'orders.customerId.isPrimeUser': 0,
        'orders.customerId.seller': 0,
        'orders.customerId.address': 0,
        'orders.customerId.unVerifiedUserExpires': 0,
        'orders.customerId.createdAt': 0,
        'orders.customerId.updatedAt': 0,
        'orders.customerId.__v': 0
      }
    },

    {
      '$match': {
        'orders.product.shopId': new Types.ObjectId(req.query.shopId as string)
      }
    },
    {
      '$set': {
        'order': '$orders'
      }
    }, {
      '$set': {
        'order.product.productId': '$order.product._id',
        'order.orderId': '$order._id'
      }
    }, {
      '$project': {
        'orders': 0,
        'order.productId': 0,
        'order.product.reviews': 0,
        'order.product._id': 0,
        'order.product.__v': 0,
        'order.product.createdAt': 0,
        'order.product.updatedAt': 0,
        'order._id': 0
      }
    }, {
      '$sort': req.query.sort ? SortMap[req.query.sort as string] ?? { 'order.orderDate': 1 } : { 'order.orderDate': 1 }
    }, {
      '$facet': {
        'orders': [
          {
            '$skip': skip
          }, {
            '$limit': resultPerPage
          }
        ]
      }
    }
    ]
    type Code = "N" | "P" | "C" | "D" | "S"
    if (req.query.filterBy) {
      const copyPipeLine = pipelineGeneral.pop()
      const pipeline = {
        '$match': {
          'order.orderStatus': NumToStatusMap[req.query.filterBy as Code]
        }
      }
      pipelineGeneral[pipelineGeneral.length - 1] = pipeline
      pipelineGeneral.push(copyPipeLine!)
    }

    let pipeline: any;
    if (req.query.search) {
      if (req.query.search) {
        const key = req.query.search as string
        pipeline = getMatchPipleLine(key.split(":")[0], key.split(":")[1])
      }

      if (pipeline) {
        const copyPipeLine = pipelineGeneral.pop()

        pipelineGeneral[pipelineGeneral.length - 1] = pipeline
        pipelineGeneral.push(copyPipeLine!)
      }
    }

    const orders = await OrderModel.aggregate(pipelineGeneral)

    const orderArray: any[] = []
    orders[0].orders.forEach((e: any) => {
      orderArray.push(e.order)
    });
    const totalOrders = await OrderModel.aggregate(
      [
        {
          '$lookup': {
            'from': 'carts',
            'localField': 'cartId',
            'foreignField': '_id',
            'as': 'cart'
          }
        }, {
          '$group': {
            '_id': {
              'orders': '$cart.products',
              'cartId': '$cartId',
              'shippingAddress': '$shippingAddress',
              'orderDate': '$createdAt',
              'paymentDetails': '$paymentDetails',
              'customerId': '$userId'
            }
          }
        }, {
          '$unwind': {
            'path': '$_id'
          }
        }, {
          '$unwind': {
            'path': '$_id.orders'
          }
        }, {
          '$addFields': {
            'orders': {
              '$map': {
                'input': {
                  '$objectToArray': '$_id.orders'
                },
                'as': 'item',
                'in': {
                  'k': '$$item.k',
                  'v': {
                    '$mergeObjects': [
                      '$$item.v', {
                        'cartId': '$_id.cartId'
                      }, {
                        'shippingAddress': '$_id.shippingAddress'
                      }, {
                        'orderDate': '$_id.orderDate'
                      }, {
                        'paymentDetails': '$_id.paymentDetails'
                      }, {
                        'customerId': '$_id.customerId'
                      }
                    ]
                  }
                }
              }
            }
          }
        }, {
          '$project': {
            '_id': 0
          }
        }, {
          '$project': {
            'ordersArray': {
              '$map': {
                'input': '$orders',
                'as': 'product',
                'in': {
                  'productId': '$$product.k',
                  'cartItem': '$$product.v'
                }
              }
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'orders': {
              '$map': {
                'input': '$ordersArray',
                'as': 'product',
                'in': '$$product.cartItem'
              }
            }
          }
        }, {
          '$unwind': {
            'path': '$orders'
          }
        }, {
          '$lookup': {
            'from': 'products',
            'localField': 'orders.productId',
            'foreignField': '_id',
            'as': 'orders.productId'
          }
        }, {
          '$set': {
            'orders.productId': {
              '$arrayElemAt': [
                '$orders.productId', 0
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'orders.customerId',
            'foreignField': '_id',
            'as': 'orders.customerId'
          }
        }, {
          '$set': {
            'orders.customerId': {
              '$arrayElemAt': [
                '$orders.customerId', 0
              ]
            }
          }
        }, {
          '$project': {
            'orders.customerId.password': 0,
            'orders.customerId.role': 0,
            'orders.customerId.emailVerified': 0,
            'orders.customerId.forgotpasswordTokenVerfied': 0,
            'orders.customerId.isPrimeUser': 0,
            'orders.customerId.seller': 0,
            'orders.customerId.address': 0,
            'orders.customerId.unVerifiedUserExpires': 0,
            'orders.customerId.createdAt': 0,
            'orders.customerId.updatedAt': 0,
            'orders.customerId.__v': 0
          }
        }, {
          '$set': {
            'order': '$orders'
          }
        }, {
          '$set': {
            'order.product': '$order.productId'
          }
        }, {
          '$set': {
            'order.product.productId': '$order.product._id',
            'order.orderId': '$order._id'
          }
        }, {
          '$project': {
            'orders': 0,
            'order.productId': 0,
            'order.product.reviews': 0,
            'order.product._id': 0,
            'order.product.__v': 0,
            'order.product.createdAt': 0,
            'order.product.updatedAt': 0,
            'order._id': 0
          }
        }, {
          '$group': {
            '_id': null,
            'totalOrders': {
              '$sum': 1
            }
          }
        }
      ]
    )

    if (!orders) return
    const TotalPages = Math.round(totalOrders[0].totalOrders / resultPerPage) - 1
    sendHTTPResponse({ res, message: { orders: orderArray, resultsShowing: orderArray.length, page, TotalPages }, statusCode: 200, success: true })

  } catch (error: unknown) {
    const errorObj = error as CustomError
    console.log('rrror', error)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    type Code = "N" | "P" | "C" | "D" | "S"
    const statuscode: Code = req.params.code as unknown as Code
    const cartId = req.params.cartId
    const productId = req.params.productId
    const userOrders = await CartModel.findById(cartId).populate({ path: 'products.$*.product' })

    if (!userOrders) return

    const product = userOrders.products.get(productId)!
    product.orderStatus = NumToStatusMap[statuscode] as unknown as ORDER_STATUS
    userOrders.products.set(productId, product)
    const result = await userOrders.save()
    sendHTTPResponse({ res, message: { message: NumToStatusMap[statuscode] }, statusCode: 200, success: true })

  } catch (error: unknown) {
    const errorObj = error as CustomError
    console.log('rrror', error)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }

}
