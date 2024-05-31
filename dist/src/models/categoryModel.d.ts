import { Model, Types, Document } from 'mongoose';
export interface CategoryCore {
    _id: Types.ObjectId;
    name: string;
    image: {
        secure_url: string;
    };
    description: string;
    updated: Date;
    created: Date;
}
export type CategoryDocument = CategoryCore & Document;
declare const _default: Model<CategoryDocument, {}, {}, {}, Document<unknown, {}, CategoryDocument> & Omit<CategoryCore & Document<any, any, any> & {
    _id: Types.ObjectId;
}, never>, any>;
export default _default;
//# sourceMappingURL=categoryModel.d.ts.map