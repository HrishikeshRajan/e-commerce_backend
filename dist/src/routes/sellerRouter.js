"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("@middlewares/auth");
const seller = __importStar(require("@controllers/sellerController"));
const category = __importStar(require("@controllers/categoryController"));
const flashsale = __importStar(require("@controllers/salesController"));
const promo = __importStar(require("@controllers/promoController"));
const roles_1 = require("@middlewares/roles");
const image_helper_1 = require("@utils/image.helper");
const router = express_1.default.Router();
var ROLES;
(function (ROLES) {
    ROLES["SELLER"] = "seller";
    ROLES["USER"] = "user";
})(ROLES || (ROLES = {}));
//General routes
router.route('/activate/:id').put(auth_1.isLoggedIn, seller.update);
//Shop routes
router.route('/shop').post(auth_1.isLoggedIn, seller.createShop);
router.route('/shop/:shopId').delete(auth_1.isLoggedIn, seller.deleteShop);
router.route('/shop/multiples').post(auth_1.isLoggedIn, seller.deleteShops);
router.route('/shop/:shopId').put(auth_1.isLoggedIn, seller.editShop);
//Lists only the owner shops
router.route('/shops').get(auth_1.isLoggedIn, seller.listMyShops);
router.route('/shop/:shopId').get(auth_1.isLoggedIn, seller.getShopById);
//Category
router.route('/category').post(auth_1.isLoggedIn, image_helper_1.multerUpload, (0, roles_1.Role)(ROLES.SELLER), category.create);
router.route('/category/:catId').put(auth_1.isLoggedIn, image_helper_1.multerUpload, (0, roles_1.Role)(ROLES.SELLER), category.update);
router.route('/category/:catId').delete(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), category.deleteCategory);
router.route('/categories').get(category.getAll);
//Flah sale
router.route('/flashsale').post(auth_1.isLoggedIn, image_helper_1.multerUpload, (0, roles_1.Role)(ROLES.SELLER), flashsale.create);
router.route('/flashsale').get(flashsale.get);
router.route('/flashsale/checkout/:saleId').post(auth_1.isLoggedIn, flashsale.moveToCart);
//Promo
router.route('/promo').post(auth_1.isLoggedIn, image_helper_1.multerUpload, (0, roles_1.Role)(ROLES.SELLER), promo.create);
router.route('/promo').get(auth_1.isLoggedIn, promo.get);
router.route('/promo/all').get(promo.getAllPromos);
// router.route('/promo/user/all').get(promo.getAllMyPromos)
router.route('/promo/status').put(auth_1.isLoggedIn, promo.updatePromoStatus);
//Marketplace
router.route('/estimateCount').get(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), seller.countTotals);
router.param('id', seller.injectUser);
router.param('shopId', seller.injectShop);
exports.default = router;
//# sourceMappingURL=sellerRouter.js.map