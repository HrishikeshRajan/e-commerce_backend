import mongoose, { Types, Document } from "mongoose";
import { Method } from "types/Offer";
export interface FlashSaleDocument extends Document {
    name: string;
    method: Method;
    type: 'PERCENTAGE' | 'FLAT';
    banner: {
        secure_url: string;
    };
    startTime: Date;
    endTime: Date;
    discountPercentage?: number;
    discountAmount?: number;
    priceAfterDiscount?: number;
    product: Types.ObjectId;
    totalQuantityToSell: number;
    currentStock: number;
    users: {
        maxUsersCount: number;
        usedBy: Types.ObjectId[];
    };
    status: string;
    createdAt: Date;
    shop?: Types.ObjectId;
    position: 'TOP' | 'MIDDLE' | 'BOTTOM';
}
export declare const enum SalesStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED"
}
declare const FlashSale: mongoose.Model<FlashSaleDocument, {}, {}, {}, mongoose.Document<unknown, {}, FlashSaleDocument> & Omit<FlashSaleDocument & {
    _id: Types.ObjectId;
}, never>, mongoose.Schema<FlashSaleDocument, mongoose.Model<FlashSaleDocument, any, any, any, mongoose.Document<unknown, any, FlashSaleDocument> & Omit<FlashSaleDocument & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FlashSaleDocument, mongoose.Document<unknown, {}, mongoose.FlatRecord<FlashSaleDocument>> & Omit<mongoose.FlatRecord<FlashSaleDocument> & {
    _id: Types.ObjectId;
}, never>>>;
export default FlashSale;
//# sourceMappingURL=flashSale.model.d.ts.map