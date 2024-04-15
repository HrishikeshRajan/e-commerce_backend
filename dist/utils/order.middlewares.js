"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATE_ORDER_USER_STATUS_SCHEMA = exports.VALIDATE_ORDER_USER_SCHEMA = exports.VALIDATE_CART_USER_SCHEMA = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.VALIDATE_CART_USER_SCHEMA = zod_1.z.object({
    cart_id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: "Invalid product id" }),
    user_id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: "Invalid user id" })
});
exports.VALIDATE_ORDER_USER_SCHEMA = zod_1.z.object({
    order_id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: "Invalid product id" }),
    user_id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: "Invalid user id" })
});
exports.VALIDATE_ORDER_USER_STATUS_SCHEMA = zod_1.z.object({
    order_id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: "Invalid product id" }),
    user_id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: "Invalid user id" }),
    status: zod_1.z.string().nonempty(),
});
//# sourceMappingURL=order.middlewares.js.map