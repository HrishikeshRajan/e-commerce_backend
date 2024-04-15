"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARAMS_WITH_ID_SCHEMA = exports.CART_QTY_SCHEMA = exports.ADD_TO_CART_SCHEMA = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.ADD_TO_CART_SCHEMA = zod_1.z.object({
    productId: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: 'Invalid product id' }),
    userId: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }, { message: 'Invalid user id' }),
    qty: zod_1.z.number().min(1),
    price: zod_1.z.number().min(1)
});
exports.CART_QTY_SCHEMA = zod_1.z.object({
    qty: zod_1.z.number().min(0),
    userId: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    }),
    productId: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    })
});
exports.PARAMS_WITH_ID_SCHEMA = zod_1.z.object({
    id: zod_1.z.string().refine((id) => {
        if (mongoose_1.default.isValidObjectId(id)) {
            return true;
        }
        else {
            return false;
        }
    })
});
//# sourceMappingURL=cart.schemaTypes.js.map