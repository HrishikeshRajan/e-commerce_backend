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
const flashSaleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    method: {
        type: String,
        enum: ['COUPON', 'VOUCHER', 'FLASHSALE', 'CLEARENCE_SALE'],
        default: 'FLASHSALE'
    },
    type: {
        type: String,
        enum: ['PERCENTAGE', 'FLAT', 'FREESHIPPING'],
    },
    banner: {
        secure_url: String
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    discountPercentage: {
        type: Number,
    },
    discountAmount: {
        type: Number,
    },
    priceAfterDiscount: {
        type: Number,
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    totalQuantityToSell: {
        type: Number,
        default: 1
    },
    currentStock: {
        type: Number,
        default: 0
    },
    users: {
        maxUsersCount: {
            type: Number,
            default: 0
        },
        usedBy: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]
    },
    status: {
        type: String,
        enum: ["PENDING" /* SalesStatus.PENDING */, "ACTIVE" /* SalesStatus.ACTIVE */, "EXPIRED" /* SalesStatus.EXPIRED */],
        default: "PENDING" /* SalesStatus.PENDING */
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shop: {
        type: mongoose_1.Types.ObjectId,
        ref: 'shop'
    },
    position: {
        type: String,
        enum: ['TOP', 'MIDDLE', 'BOTTOM'],
        default: 'TOP'
    }
});
flashSaleSchema.pre(/^save$/, async function (next) {
    const flash = this;
    let current = new Date();
    if (current > flash.startTime && current < flash.endTime) {
        flash.status = "ACTIVE" /* SalesStatus.ACTIVE */;
    }
    next();
});
flashSaleSchema.pre(/^save$/, async function (next) {
    const flash = this;
    if (flash.currentStock <= 0) {
        flash.status = "EXPIRED" /* SalesStatus.EXPIRED */;
    }
    next();
});
const FlashSale = mongoose_1.default.model('FlashSale', flashSaleSchema);
exports.default = FlashSale;
//# sourceMappingURL=flashSale.model.js.map