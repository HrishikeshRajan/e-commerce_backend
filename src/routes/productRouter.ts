import express, { type Router } from 'express'
import * as schema from '../types/zod/product.schemaTypes'

//Middlewares
import { Role } from '../middlewares/roles'
import { validateRequest } from '../middlewares/userInputValidator'
import { isLoggedIn } from '../middlewares/auth'

//Controllers
import * as product from '../controllers/productController'
import * as suggestion from '../controllers/searchSuggestionController'

//Utils
import { multerUploadArray } from '../utils/image.helper'


const router: Router = express.Router()

enum ROLES {
    SELLER = 'seller',
    USER ='user'
}

//API ACCESS: seller
router.route('/').post(isLoggedIn,Role(ROLES.SELLER), multerUploadArray, validateRequest({body:schema.productSchema}),  product.add)
router.route('/:productId').put(isLoggedIn,Role(ROLES.SELLER), multerUploadArray, validateRequest({body:schema.productSchema}) ,product.update)
router.route('/:productId').delete(isLoggedIn,Role(ROLES.SELLER),validateRequest({params:schema.productIdSchema}) ,product.deleteProduct)

router.route('/item/:id').get(product.singleProduct)

router.route('/multiples').post(isLoggedIn,Role(ROLES.SELLER), validateRequest({body:schema.productIdsSchema}) ,product.deleteProducts)
router.route('/seller/list').get(isLoggedIn,Role(ROLES.SELLER),validateRequest({query:schema.productQuerySchema}) ,product.queryProductsBySellerId)
router.route('/seller/product/:id').get(isLoggedIn,Role(ROLES.SELLER) ,product.getProductById)

//API ACCESS: user
router.route('/list').get(product.queryProducts)
router.route('/categories').get(product.getCategories)
router.route('/filter').get(product.getFilterOptions)

router.route('/search').get(product.searchProducts)


//API ACCESS: user
router.route('/search/suggestions').get(suggestion.getSearchSuggestions)
router.route('/home/latest').get(product.getLatestProducts)
export default router
