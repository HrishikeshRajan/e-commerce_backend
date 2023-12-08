
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "@utils/CustomError"
import userService from '@services/user.services'
import UserRepository from "@repositories/user.repository";
import { isEmpty, merge } from "lodash";
import { GenericRequest, GenericWithShopRequest, Token } from "types/IUser.interfaces";
import { IResponse } from "types/IResponse.interfaces";
import { sendHTTPResponse } from "@services/response.services";
import { StatusCodes } from "http-status-codes";
import { userFilter } from "@utils/user.helper";
import shopModel, { ShopCore, ShopDocument } from "@models/shopModel";
import ShopRepository from "@repositories/shop.repository";
import { ID } from "../types/zod/user.schemaTypes";
import { Types } from "mongoose";

/**
 * Update the user document seller property 
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */
export const update = async (
    req: GenericRequest<{}, {}, Token>,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const userRepo = new UserRepository()
        // const service = new userService()
        if (!req.user) {
            return next(new CustomError('user property not found in req object ', StatusCodes.NOT_FOUND, false));
        }
        const updatedUser = await userRepo.setSeller(req.user.id)
        if (!updatedUser) {
            return next(new CustomError('User not found in database', StatusCodes.NOT_FOUND, false));
        }
        sendHTTPResponse({ res, message: { message: userFilter(updatedUser) }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        console.log(error)
        const errorObj = error as CustomError;
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

/**
 * Create new shop document
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */
export const createShop = async (
    req: GenericRequest<{}, ShopDocument, Token>,
    res: Response<IResponse>,
    next: NextFunction) => {
    try {
        const shop = new ShopRepository(shopModel)
        if (!req.user) {
            return next(new CustomError('user property not found in req object ', StatusCodes.NOT_FOUND, false));
        }
        merge(req.body, { owner: req.user?.id })
        const isShop = await shop.create<ShopDocument>(req.body)
        sendHTTPResponse({ res, message: { message: isShop }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        next(error)
    }
}

/**
 * Delete the shop document by shop id
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */
export const deleteShop = async (
    req: GenericWithShopRequest<{}, {}, {}, ShopDocument>,
    res: Response<IResponse>,
    next: NextFunction) => {
    try {

        if (isEmpty(req.shop)) {
            return next(new CustomError('shop object is not present in req object', StatusCodes.INTERNAL_SERVER_ERROR, false))

        }
        const shop = new ShopRepository(shopModel)
        const isDeleted = await shop.delete<Types.ObjectId>(req.shop._id)

        if (!isDeleted) {
            return next(new CustomError('Delete method returns null', StatusCodes.INTERNAL_SERVER_ERROR, false))
        }

        sendHTTPResponse({ res, message: { message: 'Shop successfully deleted' }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        next(error)
    }
}
/**
 * fetchs the shops by owner id
 * @param req 
 * @param res 
 * @param next 
 * @returns void 
 */
export const listMyShops = async (
    req: GenericRequest<ID, {}, Token>,
    res: Response<IResponse>,
    next: NextFunction) => {
    try {
        const shop = new ShopRepository(shopModel)
        const shopDocuments = await shop.findShopByOwnerId<string>(req.user?.id as string).limit(5)

        if (!shopDocuments) {
            return next(new CustomError('Now shop not found for given userid', StatusCodes.NOT_FOUND, false))
        }
        sendHTTPResponse({ res, message: { message: shopDocuments.toObject() }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        next(error)
    }
}



/**
 * Middleware that injects a user object into the req object.
 * @param {GenericRequest} req 
 * @param res 
 * @param next 
 * @param {string} id 
 * @returns void 
 */
export const injectUser = async (
    req: GenericRequest<{}, {}, {}>,
    res: Response<IResponse>,
    next: NextFunction,
    id: string): Promise<void> => {

    const userRepo = new UserRepository()
    const service = new userService()
    const userObject = await service.getUser(userRepo, id)

    if (!userObject) {
        return next(new CustomError('User not found', StatusCodes.NOT_FOUND, false))
    }
    const user = { user: userFilter(userObject) };
    merge(req, user)
    next()
}

/**
 * Middleware that injects a shop object into the req object.
 * @param {GenericRequest} req 
 * @param res 
 * @param next 
 * @param {string} id 
 * @returns void 
 */
export const injectShop = async (
    req: GenericRequest<{}, {}, {}>,
    res: Response<IResponse>,
    next: NextFunction,
    id: string): Promise<void> => {

    const shopRepo = new ShopRepository(shopModel)
    //mongoose shop document
    const shopDocument = await shopRepo.findById<string>(id);
    if (!shopDocument) {
        return next(new CustomError('Shop not found', StatusCodes.NOT_FOUND, false))
    }

    //Here we convert it in to plain javascript object
    const shopObj = shopDocument.toObject();
    const shop = { shop: shopObj };

    //Merge it with request object
    merge(req, shop)
    next()
}





//Add Shops
//Edit Shops
//Delete Shops
//list Shops
//list specific shop
//list owner shops

