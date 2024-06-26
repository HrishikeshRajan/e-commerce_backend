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
const mongoose_1 = __importStar(require("mongoose"));
const PromoSchema = new mongoose_1.Schema({
    offername: { type: String, required: true },
    banner: { secure_url: { type: String } },
    type: { type: String, enum: ['PERCENTAGE', 'FLAT'], required: true },
    method: { type: String, enum: ['COUPON', 'VOUCHER'], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    code: { type: String, trim: true, unique: true },
    discountPercentage: { type: Number },
    maxUsage: { type: Number, required: true },
    usedBy: [{
            userId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
            products: (Array),
            count: { type: Number }
        }],
    discountAmount: { type: Number },
    minAmountInCart: { type: Number },
    maxUsagePerUser: { type: Number },
    tags: {
        categories: [
            { type: mongoose_1.Types.ObjectId, ref: 'Category' }
        ],
        products: [String],
        users: [
            {
                type: mongoose_1.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    status: {
        type: String,
        trim: true,
        enum: ["PENDING" /* Status.PENDING */, "ACTIVE" /* Status.ACTIVE */, "EXPIRED" /* Status.EXPIRED */],
        default: "PENDING" /* Status.PENDING */
    }
});
// Create and export the Mongoose model
const PromoModel = mongoose_1.default.model('Promo', PromoSchema);
exports.default = PromoModel;
//# sourceMappingURL=promoModel.js.map