import express from 'express'
import * as orderController from '@controllers/orderController'
import { isLoggedIn } from '@middlewares/auth'
const router = express.Router()

router.route('/byShops').get(isLoggedIn, orderController.ListByShop)
router.route('/list').get(isLoggedIn,orderController.List)
router.route('/create').post(express.raw({ type: "application/json" }),orderController.paymentIntent)
router.route('/webhook').post(orderController.StripeWebHook)
router.route('/:cartId').post(isLoggedIn, orderController.create)
router.route('/:orderId/addresses/:addressId').put(isLoggedIn,orderController.addShippingAddress)
router.route('/:orderId').get(isLoggedIn ,orderController.getSingleOrder)
router.route('/cancel/carts/:cartId/products/:productId').put(isLoggedIn, orderController.cancelOrder)
router.route('/status/:code/carts/:cartId/products/:productId').put(isLoggedIn, orderController.updateOrderStatus)



 
export default router