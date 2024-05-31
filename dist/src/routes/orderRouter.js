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
const orderController = __importStar(require("@controllers/orderController"));
const auth_1 = require("@middlewares/auth");
const router = express_1.default.Router();
router.route('/byShops').get(auth_1.isLoggedIn, orderController.ListByShop);
router.route('/list').get(auth_1.isLoggedIn, orderController.List);
router.route('/create').post(express_1.default.raw({ type: "application/json" }), orderController.paymentIntent);
router.route('/webhook').post(orderController.StripeWebHook);
router.route('/:cartId').post(auth_1.isLoggedIn, orderController.create);
router.route('/:orderId/addresses/:addressId').put(auth_1.isLoggedIn, orderController.addShippingAddress);
router.route('/:orderId').get(auth_1.isLoggedIn, orderController.getSingleOrder);
router.route('/cancel/carts/:cartId/products/:productId').put(auth_1.isLoggedIn, orderController.cancelOrder);
router.route('/status/:code/carts/:cartId/products/:productId').put(auth_1.isLoggedIn, orderController.updateOrderStatus);
router.route('/success/all').get(auth_1.isLoggedIn, orderController.myPurchases);
exports.default = router;
//# sourceMappingURL=orderRouter.js.map