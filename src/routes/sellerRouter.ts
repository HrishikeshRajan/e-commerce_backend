
import express, { type Router } from 'express'
import { isLoggedIn } from '@middlewares/auth'
import * as seller from '@controllers/sellerController'
const router: Router = express.Router()

//General routes
router.route('/activate/:id').put(isLoggedIn,seller.update)


router.param('id',seller.injectUser)
export default router
