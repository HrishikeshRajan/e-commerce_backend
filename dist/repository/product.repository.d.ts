import { FilterQuery, type Model, type Query } from 'mongoose';
import { type ProductDocument, type ProductCore, type DeleteResult, type BrandCount, type ColorCount, type ProductNameCount } from '../types/product.interface';
import { type IProduct } from 'types/IProduct.interface';
/**
 * Author : Hrishikesh Rajan
 *
 * Lower Level class that depend on IProduct
 */
export declare class ProductRepo<T extends ProductDocument> implements IProduct {
    private readonly ProductModel;
    constructor(model: Model<T>);
    /**creates new document
     * @param {ProductCore} product
     * @returns plain object
     */
    create<T>(product: T): Promise<ProductDocument>;
    /**
     * finds new document that satifies both ids
     * @param {string} productId
     * @param {string} userId
     * @returns plain object
     */
    getProductById<T extends String>(productId: T, userId: T): Promise<ProductDocument | null>;
    /**
     * find core product
     * @param {string} productId
     * @returns plain object
     */
    findProductById(productId: string): Promise<ProductDocument | null>;
    /**
     * finds product document by id
     * @param {string} productId
     * @returns plain object
     */
    getSingleProduct<T>(productId: T): Promise<ProductDocument | null>;
    /**
      * merges and update the document
      * @param {ProductDocument} product
      * @param {ProductCore} body
      * @returns plain object
      */
    updateProduct<T extends ProductDocument, P extends ProductCore>(product: T, body: P): Promise<ProductDocument>;
    /**
       * finds new document that satifies both ids and deletes it
       * @param {string} productId
       * @param {string} userId
       * @returns
       */
    deleteProductById<T extends String>(productId: T, userId: T): Promise<any | null>;
    /**
      * Query method that returns mongoose query object based on seller id
      * @param {string} userId
      * @returns plain object
      */
    queryProductsBySellerId<T extends String>(userId: T): Query<ProductDocument[] | null, ProductDocument, {}, ProductDocument>;
    /**
     * Query method that returns mongoose query object based on id
     * @param {string} userId
     * @returns plain object
     */
    queryProductsByShopId<T, D extends String>(shopId: D, userId: T): Query<ProductDocument[] | null, ProductDocument, {}, ProductDocument>;
    /**
      * Counts the total number of documents
      * @param {string} userId
      * @returns {number} promise
      */
    countTotalProductsBySellerId<T extends String>(userId: T): Promise<number>;
    /**
     * Counts the total number of documents
     * @param {string} userId
     * @returns {number} promise
     */
    countTotalProductsByShopId<T, D extends String>(userId: T, shopId: D): Promise<number>;
    /**
     * Counts the total number of documents based on category
     * @returns {number} promise
     */
    countTotalProductsByCategory<T>(category: T): Promise<number>;
    /**
     * Counts the total number of documents based on category
     * @returns {number} promise
     */
    countTotalProductsByQuery(query: any): Promise<number>;
    /**
      * Deletes product documents from array of id's
      * @param {string[]} productsIds
      * @returns {number} promise
      */
    deleteProductsByIds<I>(productsIds: I[]): Promise<DeleteResult>;
    /**
      * fetches all the unique category
      * @returns  promise
      */
    getCategory(): Promise<Array<string>>;
    /**
      * fetches all the unique Brands names
      * @returns {number} promise
      */
    getBrandNames(query: FilterQuery<{
        category: string;
    }>): Promise<Array<string>>;
    /**
      * fetches all the unique colors
      * @returns promise
      */
    getColors(query: FilterQuery<{
        category: string;
    }>): Promise<Array<string>>;
    /**
      * Calculates color counts
      * @returns promise
      */
    getColorCount(category: string): Promise<Array<ColorCount>>;
    /**
    * Calculates brand counts
    * @returns promise
    */
    getBrandCount(category: string): Promise<Array<BrandCount>>;
    getUniqueProductNames(): Promise<Array<ProductNameCount>>;
}
//# sourceMappingURL=product.repository.d.ts.map