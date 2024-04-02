import express from "express"

import * as cartController from '@controllers/cartController'
import { isLoggedIn } from "@middlewares/auth"

const router = express.Router()
router.route('/').get(isLoggedIn,cartController.get)
router.route('/ids').get(isLoggedIn,cartController.getCartAndUserIds)
router.route('/latest').get(isLoggedIn,cartController.getLatestCartByUserId)
router.route('/').post(isLoggedIn, cartController.add)
router.route('/flash').post(isLoggedIn, cartController.addFlashCart)
router.route('/flash/status/:flashsaleId').put(isLoggedIn, cartController.setFlashSaleStatus)
router.route('/qty/products/:productId/carts/:cartId').put(isLoggedIn, cartController.updateQty)
router.route('/size/products/:productId/carts/:cartId').put(isLoggedIn ,cartController.updateSize)
router.route('/products/:productId/carts/:cartId').delete(isLoggedIn, cartController.deleteProduct)
router.route('/:cartId').delete(isLoggedIn, cartController.deleteCart)


export default router