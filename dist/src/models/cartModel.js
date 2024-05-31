"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumToStatusMap = exports.CART_STATUS = exports.ORDER_STATUS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["NOT_PROCESSED"] = "Not_processed";
    ORDER_STATUS["PROCESSING"] = "Processing";
    ORDER_STATUS["SHIPPED"] = "Shipped";
    ORDER_STATUS["CANCELED"] = "CANCELED";
    ORDER_STATUS["DELIVERED"] = "Delivered";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
var CART_STATUS;
(function (CART_STATUS) {
    CART_STATUS["ACTIVE"] = "Active";
    CART_STATUS["EXPIRED"] = "Expired";
})(CART_STATUS || (exports.CART_STATUS = CART_STATUS = {}));
var NumToStatusMap;
(function (NumToStatusMap) {
    NumToStatusMap["N"] = "Not_processed";
    NumToStatusMap["P"] = "Processing";
    NumToStatusMap["S"] = "Shipped";
    NumToStatusMap["C"] = "CANCELED";
    NumToStatusMap["D"] = "Delivered";
})(NumToStatusMap || (exports.NumToStatusMap = NumToStatusMap = {}));
;
// Define schema for Cart
const cartItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    qty: Number,
    options: {
        color: {
            type: String,
            require: true
        },
        size: {
            type: String,
            require: true
        }
    },
    totalPrice: Number,
    orderStatus: {
        type: String,
        enum: [ORDER_STATUS.NOT_PROCESSED, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED],
        default: ORDER_STATUS.NOT_PROCESSED
    },
    gstInPercentage: {
        type: Number,
        enum: [5, 12]
    },
    taxAmount: Number,
    totalPriceBeforeTax: Number,
    totalPriceAfterTax: Number,
    discount: {
        discountSourceId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            refPath: 'source',
        },
        source: {
            type: String,
            enum: ['FlashSale']
        }
    },
    appliedOffer: {
        type: {
            type: String,
            enum: ['FLAT', 'PERCENTAGE'],
        },
        method: {
            type: String,
            enum: ['COUPON', 'VOUCHER', 'FLASHSALE', 'FREE_SHIPPING'],
        },
        originalAmount: {
            type: Number,
        },
        discountFixedAmount: {
            type: Number,
        },
        discountPercentage: {
            type: Number,
        },
        discountedPrice: {
            type: Number,
        },
        tax: {
            type: Number,
        },
        discountedPriceAftTax: {
            type: Number,
        },
        yourSavings: {
            type: Number,
        },
        couponId: {
            type: String,
        },
        productId: {
            type: String
        },
        promoCode: {
            type: String,
        }
    },
});
//Cart have multiple products
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    products: {
        type: Map,
        of: cartItemSchema,
        default: {}
    },
    grandTotalPrice: Number,
    grandTotalQty: Number,
    status: {
        type: String,
        enum: [CART_STATUS.ACTIVE, CART_STATUS.EXPIRED],
        default: CART_STATUS.ACTIVE
    }
}, { timestamps: true });
const CartModel = mongoose_1.default.model('Cart', cartSchema);
cartSchema.post('save', function (doc) {
    if (Object.values(this.products).length < 1) {
    }
});
exports.default = CartModel;
//# sourceMappingURL=cartModel.js.map