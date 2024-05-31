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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdsSchema = exports.productQuerySchema = exports.productIdSchema = exports.productSchema = void 0;
const z = __importStar(require("zod"));
// Define sub-schemas
const photoSchema = z.object({
    url: z.string(),
    secure_url: z.string(),
});
const reviewSchema = z.object({
    userId: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    star: z.number().int().min(0).max(5),
    date: z.date().default(() => new Date()),
});
// Define the main Product schema
exports.productSchema = z.object({
    name: z.string(),
    price: z.string(),
    currencyCode: z.string(),
    description: z.string(),
    category: z.string(),
    brand: z.string(),
    sellerId: z.string().optional(),
    sizes: z.array(z.string()),
    color: z.string(),
    gender: z.string(),
    isDiscontinued: z.string(),
    keywords: z.array(z.string()).optional(),
    shopId: z.string(),
    stock: z.string()
});
exports.productIdSchema = z.object({
    productId: z.string()
});
exports.productQuerySchema = z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    size: z.string().optional(),
    ratings: z.string().optional(),
    brand: z.string().optional(),
    color: z.string().optional(),
    isDiscontinued: z.string().optional(),
    description: z.string().optional(),
    price: z.string().optional(),
    sort: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
}).strict({ message: 'Please provide a valid query' });
exports.productIdsSchema = z.object({
    productsIds: z.array(z.string())
}).strict({ message: 'Please provide a valid products ids' });
//# sourceMappingURL=product.schemaTypes.js.map