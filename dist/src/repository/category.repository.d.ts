/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { CategoryCore, CategoryDocument } from "@models/categoryModel";
import { Model } from "mongoose";
export declare class CategoryRepo {
    category: Model<CategoryDocument>;
    constructor(categoryModel: Model<CategoryDocument>);
    /**
     * Create new category document
     */
    create(values: CategoryCore): Promise<import("mongoose").Document<unknown, {}, CategoryDocument> & Omit<CategoryCore & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    /**
      * Find category document
      */
    getCategoryById(categoryId: string): Promise<(import("mongoose").Document<unknown, {}, CategoryDocument> & Omit<CategoryCore & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>) | null>;
    /**
      * Get all categorys
      */
    getAll(): Promise<(import("mongoose").Document<unknown, {}, CategoryDocument> & Omit<CategoryCore & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    /**
     *
     * @param {string} categoryId
     * @returns deleted document
     */
    delete(categoryId: string): Promise<(import("mongoose").Document<unknown, {}, CategoryDocument> & Omit<CategoryCore & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>) | null>;
    /**
     *
     * @param categoryId
     * @param fields
     * @returns updated document
     */
    edit(categoryId: string, fields: CategoryCore): Promise<(import("mongoose").Document<unknown, {}, CategoryDocument> & Omit<CategoryCore & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>) | undefined>;
}
//# sourceMappingURL=category.repository.d.ts.map