import express, { type Router } from 'express'
import * as product from '../controllers/productController'

// import { multerUpload, multerUploadArray } from '../utils/image.helper';
import { isLoggedIn } from '../middlewares/auth'
import { multerUpload } from '@utils/image.helper'
const router: Router = express.Router()

router.route('/add').post(isLoggedIn,multerUpload ,product.add)

export default router
