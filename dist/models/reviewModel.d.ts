import mongoose, { Document } from 'mongoose';
export interface ReviewDocument extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    star: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ReviewDocument, {}, {}, {}, mongoose.Document<unknown, {}, ReviewDocument> & Omit<ReviewDocument & {
    _id: mongoose.Types.ObjectId;
}, never>, any>;
export default _default;
//# sourceMappingURL=reviewModel.d.ts.map