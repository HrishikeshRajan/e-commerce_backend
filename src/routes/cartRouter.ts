import express from "express"

import * as cartController from '@controllers/cartController'
import { isLoggedIn } from "@middlewares/auth"

const router = express.Router()
router.route('/').get(cartController.get)
router.route('/').post(isLoggedIn, cartController.add)
router.route('/qty/products/:productId/carts/:cartId').put(isLoggedIn, cartController.updateQty)
router.route('/size/products/:productId/carts/:cartId').put(isLoggedIn ,cartController.updateSize)
router.route('/products/:productId/carts/:cartId').delete(isLoggedIn, cartController.deleteProduct)
router.route('/:cartId').delete(isLoggedIn, cartController.deleteCart)


export default router