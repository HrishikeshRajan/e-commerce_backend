import { type Response, type NextFunction } from 'express';
import { type GenericRequest, type Token } from 'types/IUser.interfaces';
import { type ProductCore } from 'types/product.interface';
import { type GenericRequestWithQuery } from 'types/IProduct.interface';
import { ProductIdsSchemaType, ProductSchemaType } from 'types/zod/product.schemaTypes';
/**
 * API ACCESS: seller
 * Create new product document
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const add: (req: GenericRequest<{}, ProductSchemaType, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Updates the product owned by seller id
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const update: (req: GenericRequest<{
    productId: string;
}, ProductCore, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Delete product by product and seller ids
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const deleteProduct: (req: GenericRequest<{
    productId: string;
}, ProductCore, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Finds single document
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const singleProduct: (req: GenericRequest<{
    id: string;
}, {}, {}>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Delete the products by seller and products ids
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const deleteProducts: (req: GenericRequest<{}, ProductIdsSchemaType, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Query the products owned by seller id as default
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const queryProductsBySellerId: (req: GenericRequestWithQuery<{}, {
    [key: string]: string | undefined;
}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Get product by product Id
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const getProductById: (req: GenericRequest<{
    id: string;
}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Query the products shop by seller id as default
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const queryProductsByShopId: (req: GenericRequestWithQuery<{}, {
    [key: string]: string | undefined;
}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: seller
 * Query the products based on category
 */
export declare const queryProducts: (req: GenericRequestWithQuery<{}, {
    [key: string]: string | undefined;
}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: User
 * Send category strings
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const getCategories: (req: GenericRequestWithQuery<{}, {
    [key: string]: string | undefined;
}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * API ACCESS: User
 * Send filter options
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
export declare const getFilterOptions: (req: GenericRequestWithQuery<{}, {
    category: string;
}, {}, {}>, res: Response, next: NextFunction) => Promise<void>;
/**
 * handles a general search on products
 */
export declare const searchProducts: (req: GenericRequestWithQuery<{}, {
    [key: string]: string | undefined;
}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=productController.d.ts.map