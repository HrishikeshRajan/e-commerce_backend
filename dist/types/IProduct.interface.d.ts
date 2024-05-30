import { FilterQuery, Query as MQuery } from 'mongoose';
import { BrandCount, ColorCount, DeleteResult, ProductCore, ProductDocument, ProductNameCount } from './product.interface';
import { Query, ParamsDictionary } from 'express-serve-static-core';
/**
 * Defines a common interface that is utilized by both the ProductRepository
 *  and ProductService classes.
 */
export interface IProduct {
    create: <T>(product: T) => Promise<ProductDocument>;
    getProductById: <T extends String>(productId: T, userId: T) => Promise<ProductDocument | null>;
    findProductById: (productId: string) => Promise<ProductDocument | null>;
    getSingleProduct: <T>(productId: T) => Promise<ProductDocument | null>;
    updateProduct: <T extends ProductDocument, P extends ProductCore>(product: T, body: P) => Promise<ProductDocument>;
    deleteProductById: <T extends String>(productId: T, userId: T) => Promise<any | null>;
    queryProductsBySellerId: <T extends String>(userId: T) => MQuery<ProductDocument[] | null, ProductDocument, {}, ProductDocument>;
    queryProductsByShopId: <T, D extends String>(shopId: D, userId: T) => MQuery<ProductDocument[] | null, ProductDocument, {}, ProductDocument>;
    countTotalProductsBySellerId: <T extends String>(userId: T) => Promise<number>;
    countTotalProductsByShopId: <T, D extends String>(userId: T, shopId: D) => Promise<number>;
    countTotalProductsByCategory: <T>(category: T) => Promise<number>;
    countTotalProductsByQuery: (query: any) => Promise<number>;
    deleteProductsByIds: <I>(productsIds: I[]) => Promise<DeleteResult>;
    getCategory: () => Promise<Array<string>>;
    getBrandNames: (query: FilterQuery<{
        category: string;
    }>) => Promise<Array<string>>;
    getColors: (query: FilterQuery<{
        category: string;
    }>) => Promise<Array<string>>;
    getColorCount: (category: string) => Promise<Array<ColorCount>>;
    getBrandCount: (category: string) => Promise<Array<BrandCount>>;
    getUniqueProductNames: () => Promise<Array<ProductNameCount>>;
}
export interface GenericRequestWithQuery<P extends ParamsDictionary, Q extends Query, B, L> extends Express.Request {
    params: P;
    body: B;
    query: Q;
    user?: L;
    cookies: {
        token: string;
    };
}
export interface ProductQuery {
    name?: string;
    category?: string;
    size?: string;
    ratings?: string;
    brand?: string;
    color?: string;
    isDiscontinued?: string;
    description?: string;
    price?: string;
    sort?: string;
    limit?: string;
    page?: string;
}
//# sourceMappingURL=IProduct.interface.d.ts.map