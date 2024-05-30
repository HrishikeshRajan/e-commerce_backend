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
const schema = __importStar(require("types/zod/product.schemaTypes"));
//Middlewares
const roles_1 = require("@middlewares/roles");
const userInputValidator_1 = require("@middlewares/userInputValidator");
const auth_1 = require("../middlewares/auth");
//Controllers
const product = __importStar(require("../controllers/productController"));
const suggestion = __importStar(require("@controllers/searchSuggestionController"));
//Utils
const image_helper_1 = require("@utils/image.helper");
const router = express_1.default.Router();
var ROLES;
(function (ROLES) {
    ROLES["SELLER"] = "seller";
    ROLES["USER"] = "user";
})(ROLES || (ROLES = {}));
//API ACCESS: seller
router.route('/').post(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), image_helper_1.multerUploadArray, (0, userInputValidator_1.validateRequest)({ body: schema.productSchema }), product.add);
router.route('/:productId').put(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), image_helper_1.multerUploadArray, (0, userInputValidator_1.validateRequest)({ body: schema.productSchema }), product.update);
router.route('/:productId').delete(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), (0, userInputValidator_1.validateRequest)({ params: schema.productIdSchema }), product.deleteProduct);
router.route('/item/:id').get(product.singleProduct);
router.route('/multiples').post(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), (0, userInputValidator_1.validateRequest)({ body: schema.productIdsSchema }), product.deleteProducts);
router.route('/seller/list').get(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), (0, userInputValidator_1.validateRequest)({ query: schema.productQuerySchema }), product.queryProductsBySellerId);
router.route('/seller/product/:id').get(auth_1.isLoggedIn, (0, roles_1.Role)(ROLES.SELLER), product.getProductById);
//API ACCESS: user
router.route('/list').get(product.queryProducts);
router.route('/categories').get(product.getCategories);
router.route('/filter').get(product.getFilterOptions);
router.route('/search').get(product.searchProducts);
//API ACCESS: user
router.route('/search/suggestions').get(suggestion.getSearchSuggestions);
exports.default = router;
//# sourceMappingURL=productRouter.js.map