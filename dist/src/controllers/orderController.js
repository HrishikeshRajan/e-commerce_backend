"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.ListByShop = exports.cancelOrder = exports.myPurchases = exports.List = exports.StripeWebHook = exports.paymentIntent = exports.getSingleOrder = exports.addShippingAddress = exports.create = void 0;
//  Order controllers
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const response_services_1 = require("../services/response.services");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const cartModel_1 = __importStar(require("@models/cartModel"));
const orderModel_1 = __importDefault(require("@models/orderModel"));
const userModel_1 = __importDefault(require("@models/userModel"));
const stripe_1 = __importDefault(require("stripe"));
const mongoose_1 = require("mongoose");
const sort_helper_1 = require("@utils/sort.helper");
const pipelines_search_1 = require("@utils/pipelines.search");
const productModel_1 = __importDefault(require("@models/productModel"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY, {
    typescript: true,
    apiVersion: '2022-11-15'
});
/**
 * Create a new order
 * @param {Request} req - HTTP request object
 * @param {Response} res - HTTP response object
 * @param {NextFunction} next - HTTP callback
 * @returns {Promise<void>}
 * @throws {CustomError} -  The error will send as response to client
 */
const create = async (req, res, next) => {
    try {
        const cart = await cartModel_1.default.findById(req.params.cartId);
        if (!cart) {
            next(new CustomError_1.default((0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND), http_status_codes_1.StatusCodes.NOT_FOUND, false));
            return;
        }
        const orderObj = {
            userId: req.user.id,
            cartId: cart._id,
            orderDetails: {
                status: 'PENDING',
                fullfiled: new Date(Date.now()).toDateString()
            },
            shippingAddress: req.body.shippingAddress
        };
        const order = (await orderModel_1.default.create(orderObj)).toObject({ flattenMaps: true });
        const orderId = order._id;
        delete order._id;
        delete order.__v;
        //@ts-ignore
        delete order.createdAt;
        //@ts-ignore
        delete order.updatedAt;
        //@ts-ignore
        order['orderId'] = orderId;
        const response = { res, message: { order }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.create = create;
/**
   * Sets shipping address
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
const addShippingAddress = async (req, res, next) => {
    try {
        const orderDoc = await orderModel_1.default.findById(req.params.orderId);
        const user = await userModel_1.default.findById(req.user.id);
        if (!user)
            return;
        const addresses = user.address;
        const selectedAddress = addresses?.find((address) => address._id.toString() === req.params.addressId.toString());
        if (orderDoc && orderDoc.shippingAddress) {
            orderDoc.shippingAddress = { ...selectedAddress };
        }
        orderDoc?.modifiedPaths();
        const order = await orderDoc?.save();
        const orderId = order._id;
        delete order._id;
        delete order.__v;
        //@ts-ignore
        delete order.createdAt;
        //@ts-ignore
        delete order.updatedAt;
        //@ts-ignore
        order['orderId'] = orderId;
        const response = { res, message: { order }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.addShippingAddress = addShippingAddress;
const getSingleOrder = async (req, res, next) => {
    try {
        const orderDoc = await orderModel_1.default.findById(req.params.orderId).select('-__v -createdAt -updatedAt').populate('userId', 'fullname _id').populate('cartId', '-__v -_id -userId -createdAt -updatedAt');
        if (!orderDoc)
            return;
        const order = orderDoc.toObject({ flattenMaps: true });
        const orderId = order._id;
        delete order._id;
        //@ts-ignore
        order['orderId'] = orderId;
        const response = { res, message: { order }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getSingleOrder = getSingleOrder;
/**
   * Payment method select controller
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
const paymentIntent = async (req, res, next) => {
    try {
        const { paymentMethodTypes, currency, cartId, orderId } = req.body;
        const userCart = await cartModel_1.default.findById(cartId).populate('products.$*product');
        if (!userCart)
            return;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: userCart?.grandTotalPrice * 100,
            currency: currency,
            payment_method_types: [paymentMethodTypes],
            metadata: {
                orderId: orderId,
                cartId: cartId
            },
        });
        (0, response_services_1.sendHTTPResponse)({ res, message: { clientSecret: paymentIntent.client_secret, id: paymentIntent.id }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.paymentIntent = paymentIntent;
const StripeWebHook = async (req, res, next) => {
    let data, eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    }
    else {
        data = req.body.data;
        eventType = req.body.type;
    }
    if (eventType === 'payment_intent.created') {
        console.log(`Payment created💸`);
        const orderId = data.object.metadata.orderId;
        await orderModel_1.default.findByIdAndUpdate(orderId, {
            $set: {
                'paymentDetails.status': 'INITIATED',
                'paymentDetails.paidAmount': Math.floor(data.object.amount_received / 100),
                'paymentDetails.paymentId': data.object.id,
            }
        });
    }
    if (eventType === 'payment_intent.succeeded') {
        const orderId = data.object.metadata.orderId;
        const cartId = data.object.metadata.cartId;
        await orderModel_1.default.findByIdAndUpdate(orderId, {
            $set: {
                'paymentDetails.status': 'SUCCESS',
                'paymentDetails.paidAmount': Math.floor(data.object.amount_received / 100),
                'paymentDetails.paymentId': data.object.id,
                'orderDetails.status': 'INITIATED',
            }
        });
        await cartModel_1.default.findByIdAndUpdate(cartId, {
            '$set': {
                'status': 'Expired'
            }
        });
        console.log('💰 Payment captured!');
    }
    else if (eventType === 'payment_intent.payment_failed') {
        console.log('❌ Payment failed.');
        const orderId = data.object.metadata.orderId;
        await orderModel_1.default.findByIdAndUpdate(orderId, {
            $set: {
                'paymentDetails.status': 'FAILED',
                'paymentDetails.paidAmount': Math.floor(0),
                'paymentDetails.paymentId': data.object.id,
                'orderDetails.status': 'CANCELED',
            }
        });
    }
    res.sendStatus(200);
};
exports.StripeWebHook = StripeWebHook;
/**
   * List  orders
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
const List = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userOrders = await orderModel_1.default.aggregate([{
                '$match': {
                    'userId': new mongoose_1.Types.ObjectId(req.user.id)
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
            }]);
        // const userOrders = 
        if (!userOrders)
            return;
        (0, response_services_1.sendHTTPResponse)({ res, message: { orders: userOrders[0].orders }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        console.log('rrror', error);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.List = List;
const myPurchases = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const carts = await cartModel_1.default.find({ status: 'Expired' }).populate({ path: 'products.$*.product' }).lean();
        let ids = [];
        for (let item of carts) {
            ids = [...ids, ...Object.keys(item.products)];
        }
        const products = [];
        const uniqIds = new Set(ids);
        for (let id of uniqIds) {
            const product = await productModel_1.default.findById(id);
            if (product) {
                products.push(product);
            }
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { orders: products }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        console.log('rrror', error);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.myPurchases = myPurchases;
/**
   * Cancel Order Controller
   *
   * @param {Request<{},JResponse, ADDRESS_VALIDATE_SCHEMA,{}>} req - HTTP request object
   * @param {Response<JResponse>} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>} - A promise that resolves when the request is complete.
   */
const cancelOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const userOrders = await cartModel_1.default.findById(cartId).populate({ path: 'products.$*.product' });
        if (!userOrders)
            return;
        const product = userOrders.products.get(productId);
        product.orderStatus = cartModel_1.ORDER_STATUS.CANCELED;
        userOrders.products.set(productId, product);
        const result = await userOrders.save();
        (0, response_services_1.sendHTTPResponse)({ res, message: { message: 'Canceled' }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        console.log('rrror', error);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.cancelOrder = cancelOrder;
/**
   * List  orders by shop
   *
   * @param {Request} req - HTTP request object
   * @param {Response} res - HTTP response object
   * @param {NextFunction} next - HTTP callback
   * @returns {Promise<void>}
   */
const ListByShop = async (req, res, next) => {
    try {
        const resultPerPage = parseInt(req.query.resultPerPage, 10) || 10;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const skip = resultPerPage * (page - 1);
        const pipelineGeneral = [{
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
                    'orders.product.shopId': new mongoose_1.Types.ObjectId(req.query.shopId)
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
                '$sort': req.query.sort ? sort_helper_1.SortMap[req.query.sort] ?? { 'order.orderDate': 1 } : { 'order.orderDate': 1 }
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
            }];
        if (req.query.filterBy) {
            const copyPipeLine = pipelineGeneral.pop();
            const pipeline = {
                '$match': {
                    'order.orderStatus': cartModel_1.NumToStatusMap[req.query.filterBy]
                }
            };
            pipelineGeneral[pipelineGeneral.length - 1] = pipeline;
            pipelineGeneral.push(copyPipeLine);
        }
        let pipeline;
        if (req.query.search) {
            if (req.query.search) {
                const key = req.query.search;
                pipeline = (0, pipelines_search_1.getMatchPipleLine)(key.split(":")[0], key.split(":")[1]);
            }
            if (pipeline) {
                const copyPipeLine = pipelineGeneral.pop();
                pipelineGeneral[pipelineGeneral.length - 1] = pipeline;
                pipelineGeneral.push(copyPipeLine);
            }
        }
        const orders = await orderModel_1.default.aggregate(pipelineGeneral);
        const orderArray = [];
        orders[0].orders.forEach((e) => {
            orderArray.push(e.order);
        });
        const totalOrders = await orderModel_1.default.aggregate([
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
        ]);
        if (!orders)
            return;
        let pages = 1;
        if (totalOrders[0].totalOrders > resultPerPage) {
            pages = Math.round(totalOrders[0].totalOrders / resultPerPage) - 1;
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { orders: orderArray, resultsShowing: orderArray.length, page, totalOrders: pages }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        console.log('rrror', error);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.ListByShop = ListByShop;
const updateOrderStatus = async (req, res, next) => {
    try {
        const statuscode = req.params.code;
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const userOrders = await cartModel_1.default.findById(cartId).populate({ path: 'products.$*.product' });
        if (!userOrders)
            return;
        const product = userOrders.products.get(productId);
        product.orderStatus = cartModel_1.NumToStatusMap[statuscode];
        userOrders.products.set(productId, product);
        const result = await userOrders.save();
        (0, response_services_1.sendHTTPResponse)({ res, message: { message: cartModel_1.NumToStatusMap[statuscode] }, statusCode: 200, success: true });
    }
    catch (error) {
        const errorObj = error;
        console.log('rrror', error);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map