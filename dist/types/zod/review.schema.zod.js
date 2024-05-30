"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewListByQueryZodSchema = exports.ReviewDeleteZodSchema = exports.ReviewIdZodSchema = exports.ReviewUpdateZodSchema = exports.ReviewZodSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.ReviewZodSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    productId: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    star: zod_1.z.number().int().min(0).max(5),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional()
});
exports.ReviewUpdateZodSchema = exports.ReviewZodSchema.omit({ userId: true });
exports.ReviewIdZodSchema = zod_1.z.object({
    reviewId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: 'Please select a review'
    })
});
exports.ReviewDeleteZodSchema = zod_1.z.object({
    productId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: 'Please select a product'
    })
}).extend(exports.ReviewIdZodSchema.shape);
exports.ReviewListByQueryZodSchema = zod_1.z.object({
    pId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: 'Please select a product'
    }),
    page: zod_1.z.string().optional()
});
//# sourceMappingURL=review.schema.zod.js.map