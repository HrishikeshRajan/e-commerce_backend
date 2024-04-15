import { Model, Types, Document } from 'mongoose';
export interface CloudinaryImage {
    id: string;
    secure_url: string;
    url: string;
}
export interface ShopReview {
    userId: Types.ObjectId;
    title: string;
    description: string;
    images: Types.DocumentArray<CloudinaryImage>;
    star: number;
    date: Date;
}
export interface ShopCore {
    _id: Types.ObjectId;
    name: string;
    logo: CloudinaryImage;
    description: string;
    reviews: Types.DocumentArray<ShopReview>;
    address: Object;
    updated: Date;
    created: Date;
    owner: Types.ObjectId;
    email: string;
    isActive: boolean;
}
export type ShopDocument = ShopCore & Document;
declare const _default: Model<ShopDocument, {}, {}, {}, Document<unknown, {}, ShopDocument> & Omit<ShopCore & Document<any, any, any> & {
    _id: Types.ObjectId;
}, never>, any>;
export default _default;
//# sourceMappingURL=shopModel.d.ts.map