import express, { type Router } from 'express'
import { isLoggedIn } from '../middlewares/auth'
import * as seller from '../controllers/sellerController';
const router: Router = express.Router()


router.route('/activate/:id').put(isLoggedIn,seller.update)

export default router
