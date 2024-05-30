"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = exports.ORDER_STATUS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["PENDING"] = "PENDING";
    ORDER_STATUS["SUCCESS"] = "SUCCESS";
    ORDER_STATUS["FAILED"] = "FAILED";
    ORDER_STATUS["CANCELED"] = "CANCELED";
    ORDER_STATUS["ACTIVE"] = "ACTIVE";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["PENDING"] = "PENDING";
    PAYMENT_STATUS["SUCCESS"] = "SUCCESS";
    PAYMENT_STATUS["FAILED"] = "FAILED";
    PAYMENT_STATUS["INITIATED"] = "INITIATED";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));
;
;
// Define schema for Cart
const orderItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    qty: Number,
    totalPrice: Number,
    options: {
        color: {
            type: String,
            require: true
        },
        size: {
            type: String,
            require: true
        }
    }
});
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    cartId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Cart",
        require: true
    },
    shippingAddress: {
        fullname: {
            type: String
        },
        city: {
            type: String
        },
        homeAddress: {
            type: String
        },
        state: {
            type: String
        },
        postalCode: {
            type: Number
        },
        phoneNo: {
            type: Number
        },
        country: {
            type: String
        }
    },
    paymentDetails: {
        status: {
            type: String,
            enum: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUCCESS, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.INITIATED],
            default: ORDER_STATUS.PENDING,
            trim: true
        },
        paidAmount: Number,
        paymentId: String
    },
    orderDetails: {
        status: {
            type: String,
            enum: [ORDER_STATUS.PENDING, ORDER_STATUS.SUCCESS, ORDER_STATUS.FAILED, ORDER_STATUS.CANCELED],
            default: ORDER_STATUS.PENDING,
            trim: true
        },
        fullfilled: {
            type: String
        }
    },
}, { timestamps: true });
const OrderModel = mongoose_1.default.model('Order', orderSchema);
exports.default = OrderModel;
//# sourceMappingURL=orderModel.js.map