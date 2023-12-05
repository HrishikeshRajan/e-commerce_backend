import express, { type Router } from 'express'
import { isLoggedIn } from '@/src/middlewares/auth'
import * as seller from '@/src/controllers/sellerController';
const router: Router = express.Router()

//General routes
router.route('/activate/:id').put(isLoggedIn,seller.update)

export default router
