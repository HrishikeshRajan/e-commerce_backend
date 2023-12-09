
import express, { type Router } from 'express'
import { isLoggedIn } from '@middlewares/auth'
import * as seller from '@controllers/sellerController'
const router: Router = express.Router()

//General routes
router.route('/activate/:id').put(isLoggedIn,seller.update)
//Shop routes
router.route('/shop').post(isLoggedIn,seller.createShop)
router.route('/shop/:shopId').delete(isLoggedIn,seller.deleteShop)
router.route('/shop/:shopId').put(isLoggedIn,seller.editShop)
//Lists only the owner shops
router.route('/shop/:id').get(isLoggedIn,seller.listMyShops)



router.param('id',seller.injectUser)
router.param('shopId',seller.injectShop)
export default router
