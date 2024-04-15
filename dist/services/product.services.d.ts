import { FilterQuery } from 'mongoose';
import { type IProduct } from '../types/IProduct.interface';
import { ProductCore, ProductDocument } from '../types/product.interface';
/**
 * Author : Hrishikesh Rajan
 *
 * Higher Level class that depend on IProduct
 */
declare class ProductServices {
    createProduct<T>(repository: IProduct, product: T): Promise<ProductDocument>;
    getProductById<T extends string>(repository: IProduct, productId: T, userId: T): Promise<ProductDocument | null>;
    findProductById(repository: IProduct, productId: string): Promise<ProductDocument | null>;
    getSingleProduct<T>(repository: IProduct, productId: T): Promise<ProductDocument | null>;
    updateProduct<T extends ProductDocument, P extends ProductCore>(repository: IProduct, product: T, body: P): Promise<ProductDocument>;
    deleteProductById<T extends string>(repository: IProduct, productId: T, userId: T): Promise<any>;
    queryProductsBySellerId<T extends string>(repository: IProduct, userId: T): Promise<ProductDocument[] | null>;
    queryProductsByShopId<T, D extends string>(repository: IProduct, shopId: D, userId: T): Promise<ProductDocument[] | null>;
    countTotalProductsBySellerId<T extends string>(repository: IProduct, userId: T): Promise<number>;
    countTotalProductsByShopId<T, D extends string>(repository: IProduct, userId: T, shopId: D): Promise<number>;
    countTotalProductsByCategory<T>(repository: IProduct, category: T): Promise<number>;
    countTotalProductsByQuery(repository: IProduct, query: any): Promise<number>;
    deleteProductsByIds<I>(repository: IProduct, productsIds: I[]): Promise<import("../types/product.interface").DeleteResult>;
    getCategory(repository: IProduct): Promise<string[]>;
    getBrandNames(repository: IProduct, query: FilterQuery<{
        category: string;
    }>): Promise<string[]>;
    getColors(repository: IProduct, query: FilterQuery<{
        category: string;
    }>): Promise<string[]>;
    getColorCount(repository: IProduct, category: string): Promise<import("../types/product.interface").ColorCount[]>;
    getBrandCount(repository: IProduct, category: string): Promise<import("../types/product.interface").BrandCount[]>;
    getUniqueProductNames(repository: IProduct): Promise<import("../types/product.interface").ProductNameCount[]>;
}
export default ProductServices;
//# sourceMappingURL=product.services.d.ts.map