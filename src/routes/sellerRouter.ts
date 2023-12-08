
import express, { type Router } from 'express'
import { isLoggedIn } from '@middlewares/auth'
import * as seller from '@controllers/sellerController'
const router: Router = express.Router()

//General routes
router.route('/activate/:id').put(isLoggedIn,seller.update)
router.route('/create').post(isLoggedIn,seller.createShop)
router.route('/:shopId').delete(isLoggedIn,seller.deleteShop)



router.param('id',seller.injectUser)
export default router
