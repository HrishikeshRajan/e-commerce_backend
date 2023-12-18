import express, { type Router } from 'express'
import * as product from '../controllers/productController'

// import { multerUpload, multerUploadArray } from '../utils/image.helper';
import { isLoggedIn } from '../middlewares/auth'
import { multerUpload } from '@utils/image.helper'
import { validateRequest } from '@middlewares/userInputValidator'
import { ProductSchemaType, productSchema } from 'types/zod/product.schemaTypes'
const router: Router = express.Router()

router.route('/add').post(isLoggedIn,multerUpload, validateRequest({body:productSchema}) ,product.add)

export default router
