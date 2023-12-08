
import { type NextFunction, type Request, type Response } from "express";
import CustomError from "@utils/CustomError"
import userService from '@services/user.services'
import UserRepository from "@repositories/user.repository";
import { get, merge } from "lodash";
import { GenericRequest, Token, UserCore } from "types/IUser.interfaces";
import { IResponse } from "types/IResponse.interfaces";
import { sendHTTPResponse } from "@services/response.services";
import { StatusCodes } from "http-status-codes";
import { userFilter } from "@utils/user.helper";
import shopModel, { ShopCore } from "@models/shopModel";
import ShopRepository from "@repositories/shop.repository";
import { ID } from "types/zod/user.schemaTypes";

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





export const createShop = async (
    req: GenericRequest<{}, ShopCore, Token>,
    res: Response<IResponse>,
    next: NextFunction) => {
    try {
        const shop = new ShopRepository(shopModel)
        const isShop = await shop.create<ShopCore>(req.body)
        sendHTTPResponse({ res, message: { message: isShop }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        next(error)
    }
}
export const deleteShop = async (
    req: GenericRequest<ID, ShopCore, Token>,
    res: Response<IResponse>,
    next: NextFunction) => {
    try {

        const shop = new ShopRepository(shopModel)
        const isDeleted = await shop.delete(req.params.id)
        if(!isDeleted){
            return next(new CustomError('Shop delete process failed', StatusCodes.INTERNAL_SERVER_ERROR, false))
        }
        sendHTTPResponse({ res, message: { message: 'Shop successfully deleted' }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        next(error)
    }
}

//Add Shops
//Edit Shops
//Delete Shops
//list Shops
//list specific shop
//list owner shops

