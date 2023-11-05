import express, { type Router } from 'express'
import { addProduct } from '../controllers/productController'

// import { multerUpload, multerUploadArray } from '../utils/image.helper';
import { isLoggedIn } from '../middlewares/auth'
const router: Router = express.Router()

router.route('/add-product').post(isLoggedIn, addProduct)

export default router
