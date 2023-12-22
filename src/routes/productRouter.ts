import express, { type Router } from 'express'
import * as schema from 'types/zod/product.schemaTypes'

//Middlewares
import { Role } from '@middlewares/roles'
import { validateRequest } from '@middlewares/userInputValidator'
import { isLoggedIn } from '../middlewares/auth'

//Controllers
import * as product from '../controllers/productController'

//Utils
import { multerUpload, multerUploadArray } from '@utils/image.helper'


const router: Router = express.Router()

enum ROLES {
    SELLER = 'seller',
    USER ='user'
}

//API ACCESS: seller
router.route('/').post(isLoggedIn,Role(ROLES.SELLER), multerUploadArray, validateRequest({body:schema.productSchema}),  product.add)
router.route('/:productId').put(isLoggedIn,Role(ROLES.SELLER),multerUpload, validateRequest({body:schema.productSchema}) ,product.update)
router.route('/:productId').delete(isLoggedIn,Role(ROLES.SELLER),validateRequest({params:schema.productIdSchema}) ,product.deleteProduct)
router.route('/seller').get(isLoggedIn,Role(ROLES.SELLER),validateRequest({query:schema.productQuerySchema}) ,product.queryProductBySellerId)


export default router
