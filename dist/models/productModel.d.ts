import mongoose, { Types } from 'mongoose';
import { type ProductDocument } from '../types/product.interface';
declare const _default: mongoose.Model<ProductDocument, {}, {}, {}, mongoose.Document<unknown, {}, ProductDocument> & Omit<import("../types/product.interface").ProductCore & mongoose.Document<any, any, any> & {
    _id: Types.ObjectId;
}, never>, any>;
export default _default;
//# sourceMappingURL=productModel.d.ts.map