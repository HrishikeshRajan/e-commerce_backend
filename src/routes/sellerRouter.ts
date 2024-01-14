
import express, { type Router } from 'express'
import { isLoggedIn } from '@middlewares/auth'
import * as seller from '@controllers/sellerController'
import * as category from '@controllers/categoryController'
import { Role } from '@middlewares/roles'
import { multerUpload } from '@utils/image.helper'
const router: Router = express.Router()

enum ROLES {
    SELLER = 'seller',
    USER ='user'
}

//General routes
router.route('/activate/:id').put(isLoggedIn,seller.update)
//Shop routes
router.route('/shop').post(isLoggedIn,seller.createShop)
router.route('/shop/:shopId').delete(isLoggedIn,seller.deleteShop)
router.route('/shop/multiples').post(isLoggedIn,seller.deleteShops)
router.route('/shop/:shopId').put(isLoggedIn,seller.editShop)
//Lists only the owner shops
router.route('/shops').get(isLoggedIn,seller.listMyShops)
router.route('/shop/:shopId').get(isLoggedIn,seller.getShopById)
//Category
router.route('/category').post(isLoggedIn,multerUpload,Role(ROLES.SELLER),category.create)
router.route('/category/:catId').put(isLoggedIn,multerUpload,Role(ROLES.SELLER),category.update)
router.route('/category/:catId').delete(isLoggedIn,Role(ROLES.SELLER),category.deleteCategory)
router.route('/categories').get(category.getAll)

router.param('id',seller.injectUser)
router.param('shopId',seller.injectShop)
export default router
