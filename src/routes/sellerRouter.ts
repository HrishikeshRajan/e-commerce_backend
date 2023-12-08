
import express, { type Router } from 'express'
import { isLoggedIn } from '@middlewares/auth'
import * as seller from '@controllers/sellerController'
const router: Router = express.Router()

//General routes
router.route('/activate/:id').put(isLoggedIn,seller.update)
router.route('/shop').post(isLoggedIn,seller.createShop)
router.route('/shop/:shopId').delete(isLoggedIn,seller.deleteShop)
//Lists only the owner shops
router.route('/shop/:id').get(isLoggedIn,seller.listMyShops)



router.param('id',seller.injectUser)
router.param('shopId',seller.injectShop)
export default router
