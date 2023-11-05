/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Router } from 'express'
import { isLoggedIn } from '../middlewares/auth'
import { deleteUser, getAllUsers } from '../controllers/adminController'
const router: Router = express.Router()

router.route('/list-all-users').get(isLoggedIn, getAllUsers)
router.route('/delete-users/:id').delete(isLoggedIn, deleteUser)
// Blockuser
// Create coupons
export default router
