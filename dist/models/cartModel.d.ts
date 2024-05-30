import { Flat, Percentage } from "@controllers/cartController";
import mongoose, { Types } from "mongoose";
export interface CartItemCore {
    product: mongoose.Types.ObjectId;
    qty: number;
    options: Options;
    totalPrice: number;
    totalPriceBeforeTax: number;
    totalPriceAfterTax: number;
    orderStatus: ORDER_STATUS;
    gstInPercentage: number;
    taxAmount: number;
    discount?: {
        discountSourceId: mongoose.Types.ObjectId;
        source: string;
    };
    appliedOffer?: Percentage | Flat;
}
export interface ResponseCart {
    userId: mongoose.Types.ObjectId;
    products: {
        [x: string]: CartItemCore;
    };
    grandTotalPrice?: number;
    grandTotalQty?: number;
    cartId: mongoose.Types.ObjectId;
}
export interface PopulatedCartItem {
    userId: mongoose.Types.ObjectId;
    products: Map<string, CartItemCore>;
    grandTotalPrice?: number;
    grandTotalQty?: number;
}
export interface CartCore {
    userId: mongoose.Types.ObjectId;
    products: Record<string, CartItemCore>;
    grandTotalPrice: number;
    grandTotalQty: number;
}
export interface Options {
    color: string;
    size: string;
}
export declare enum ORDER_STATUS {
    NOT_PROCESSED = "Not_processed",
    PROCESSING = "Processing",
    SHIPPED = "Shipped",
    CANCELED = "CANCELED",
    DELIVERED = "Delivered"
}
export declare enum CART_STATUS {
    ACTIVE = "Active",
    EXPIRED = "Expired"
}
export declare enum NumToStatusMap {
    "N" = "Not_processed",
    "P" = "Processing",
    "S" = "Shipped",
    "C" = "CANCELED",
    "D" = "Delivered"
}
export interface CartItemDocument extends mongoose.Document {
    product: mongoose.Types.ObjectId;
    qty: number;
    options: Options;
    totalPrice: number;
    totalPriceBeforeTax: number;
    totalPriceAfterTax: number;
    orderStatus: ORDER_STATUS;
    gstInPercentage: number;
    taxAmount: number;
    discount?: {
        discountSourceId: mongoose.Types.ObjectId;
        source: string;
    };
    appliedOffer?: Percentage | Flat;
}
export interface CartDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    products: Map<string, CartItemDocument>;
    grandTotalPrice: number;
    grandTotalQty: number;
    createdAt?: string;
    updatedAt?: string;
    status: CART_STATUS.ACTIVE | CART_STATUS.EXPIRED;
}
export type AppliedOffer = {
    type: 'FLAT' | 'PERCENTAGE';
    originalAmount: number;
    discountFixedAmount?: number;
    discountPercentage?: number;
    discountedPrice: number;
    tax: number;
    discountedPriceAftTax: number;
    yourSavings: number;
    couponId: string;
    productId?: string;
    promoCode: string;
};
declare const CartModel: mongoose.Model<CartDocument, {}, {}, {}, mongoose.Document<unknown, {}, CartDocument> & Omit<CartDocument & {
    _id: Types.ObjectId;
}, never>, any>;
export default CartModel;
//# sourceMappingURL=cartModel.d.ts.map