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
const cartController = __importStar(require("../controllers/cartController"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.route('/').get(auth_1.isLoggedIn, cartController.get);
router.route('/ids').get(auth_1.isLoggedIn, cartController.getCartAndUserIds);
router.route('/latest').get(auth_1.isLoggedIn, cartController.getLatestCartByUserId);
router.route('/').post(auth_1.isLoggedIn, cartController.add);
router.route('/flash').post(auth_1.isLoggedIn, cartController.addFlashCart);
router.route('/flash/status/:flashsaleId').put(auth_1.isLoggedIn, cartController.setFlashSaleStatus);
router.route('/qty/products/:productId/carts/:cartId').put(auth_1.isLoggedIn, cartController.updateQty);
router.route('/size/products/:productId/carts/:cartId').put(auth_1.isLoggedIn, cartController.updateSize);
router.route('/products/:productId/carts/:cartId').delete(auth_1.isLoggedIn, cartController.deleteProduct);
router.route('/:cartId').delete(auth_1.isLoggedIn, cartController.deleteCart);
exports.default = router;
//# sourceMappingURL=cartRouter.js.map