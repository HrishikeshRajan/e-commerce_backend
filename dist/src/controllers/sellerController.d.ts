import { type Request, type NextFunction, type Response } from "express";
import { ShopCore, ShopDocument } from "../models/shopModel";
import { GenericRequest, GenericWithShopRequest, Token } from "types/IUser.interfaces";
import { IResponse } from "types/IResponse.interfaces";
import { ID } from "../types/zod/user.schemaTypes";
import { GenericRequestWithQuery } from "types/IProduct.interface";
import { ShopsIds } from "types/zod/shop.schemaTypes";
/**
 * Update the user document seller property
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const update: (req: GenericRequest<{}, {}, Token>, res: Response, next: NextFunction) => Promise<void>;
/**
 * Create new shop document
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const createShop: (req: GenericRequest<{}, ShopDocument, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Delete the shop document by shop id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const deleteShop: (req: GenericWithShopRequest<{}, {}, {}, ShopDocument>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Delete the shop document by shop id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const deleteShops: (req: GenericWithShopRequest<{}, ShopsIds, {}, ShopDocument>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * fetchs the shops by owner id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const listMyShops: (req: GenericRequestWithQuery<{}, {
    [key: string]: string | undefined;
}, {}, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * fetchs the shop by shop id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const getShopById: (req: GenericRequest<ID, {}, Token>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Edits shops by shop id
 
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export declare const editShop: (req: GenericWithShopRequest<{}, ShopCore, Token, ShopDocument>, res: Response<IResponse>, next: NextFunction) => Promise<void>;
/**
 * Middleware that injects a user object into the req object.
 * @param {GenericRequest} req
 * @param res
 * @param next
 * @param {string} id
 * @returns void
 */
export declare const injectUser: (req: GenericRequest<{}, {}, {}>, res: Response<IResponse>, next: NextFunction, id: string) => Promise<void>;
/**
 * Middleware that injects a shop object into the req object.
 * @param {GenericRequest} req
 * @param res
 * @param next
 * @param {string} id
 * @returns void
 */
export declare const injectShop: (req: GenericRequest<{}, {}, {}>, res: Response<IResponse>, next: NextFunction, id: string) => Promise<void>;
export declare const countTotals: (req: Request, res: Response<IResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=sellerController.d.ts.map