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
const reviewController = __importStar(require("@controllers/reviewController"));
const auth_1 = require("@middlewares/auth");
const userInputValidator_1 = require("@middlewares/userInputValidator");
const review_schema_zod_1 = require("types/zod/review.schema.zod");
const router = express_1.default.Router();
router.route('/')
    .post(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ body: review_schema_zod_1.ReviewZodSchema }), reviewController.create);
router.route('/')
    .get((0, userInputValidator_1.validateRequest)({ query: review_schema_zod_1.ReviewListByQueryZodSchema }), reviewController.getReviewsByProductId);
router.route('/:reviewId')
    .put(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ params: review_schema_zod_1.ReviewIdZodSchema }), (0, userInputValidator_1.validateRequest)({ body: review_schema_zod_1.ReviewUpdateZodSchema }), reviewController.edit);
router.route('/:reviewId/:productId')
    .delete(auth_1.isLoggedIn, (0, userInputValidator_1.validateRequest)({ params: review_schema_zod_1.ReviewDeleteZodSchema }), reviewController.deleteReview);
exports.default = router;
//# sourceMappingURL=reviewRouter.js.map