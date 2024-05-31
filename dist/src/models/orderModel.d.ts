import mongoose, { Types } from "mongoose";
import { Address } from "types/IUser.interfaces";
export declare enum ORDER_STATUS {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELED = "CANCELED",
    ACTIVE = "ACTIVE"
}
export declare enum PAYMENT_STATUS {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    INITIATED = "INITIATED"
}
export interface Options {
    color: string;
    size: string;
}
export interface OrderItemCore {
    product: any;
    qty: number;
    totalPrice: number;
    options: Options;
}
export interface OrderItemDocument extends mongoose.Document {
    productId: string;
    qty: number;
    totalPrice: number;
    options: Options;
}
export interface ResponseOrder {
    userId: mongoose.Types.ObjectId;
    cartId: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    shippingAddress: {};
    paymentDetails: {};
    grandTotalPrice: number;
    grandTotalQty: number;
    orderStatus: string;
    deliveryDetails: {
        status: boolean;
        deliveryId: mongoose.Types.ObjectId;
    };
}
export interface PaymentDetails {
    status: string;
    paymentId: string;
    paidAmount: number;
}
export interface OrderDetails {
    status: string;
    fullfiled: string;
}
export interface OrderCore {
    userId: mongoose.Types.ObjectId;
    cartId: mongoose.Types.ObjectId;
    shippingAddress?: Address;
    paymentDetails?: PaymentDetails;
    orderDetails: OrderDetails;
}
export interface OrderDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    cartId: mongoose.Types.ObjectId;
    shippingAddress: Address;
    paymentDetails: PaymentDetails;
    orderDetails: OrderDetails;
}
declare const OrderModel: mongoose.Model<OrderDocument, {}, {}, {}, mongoose.Document<unknown, {}, OrderDocument> & Omit<OrderDocument & {
    _id: Types.ObjectId;
}, never>, any>;
export default OrderModel;
//# sourceMappingURL=orderModel.d.ts.map