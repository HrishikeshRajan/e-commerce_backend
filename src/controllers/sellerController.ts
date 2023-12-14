
import { type NextFunction, type Response } from "express"
import userService from '@services/user.services'
import { sendHTTPResponse } from "@services/response.services"
import UserRepository from "@repositories/user.repository"
import ShopRepository from "@repositories/shop.repository"
import shopModel, { ShopCore, ShopDocument } from "@models/shopModel"
import { shopFilter } from "@utils/shop.helper"
import { userFilter } from "@utils/user.helper"
import CustomError from "@utils/CustomError"

import { isEmpty, merge } from "lodash"
import { GenericRequest, GenericWithShopRequest, Token, UserCore } from "types/IUser.interfaces"
import { IResponse } from "types/IResponse.interfaces"
import { StatusCodes } from "http-status-codes"
import { ID } from "../types/zod/user.schemaTypes"
import { Types } from "mongoose"
import { UploadApiOptions, UploadApiResponse } from "cloudinary"
import Cloudinary from "@repositories/ImageProcessing.repository"
import { ImageProcessingServices } from "@services/image.processing.services"
import { convertToBase64 } from "@utils/image.helper"
import { imageUrl } from "types/cloudinary.interfaces"

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

        //Handles image upload 
        const options: UploadApiOptions = {
          folder: 'shop',
          gravity: 'faces',
          height: 150,
          width: 150,
          zoom: '0.6',
          crop: 'thumb'
        }
        const ImageServiceRepository = new Cloudinary()
        const imageServices = new ImageProcessingServices()
        const imageUrls = await imageServices.uploadImage(ImageServiceRepository, req.body.logo as unknown as string, options)

        const logoUrls = {
          id: imageUrls.public_id,
          secure_url: imageUrls.secure_url,
          url: imageUrls.url
        }
        const shop = new ShopRepository(shopModel)

        if (!req.user) {
            return next(new CustomError('user property not found in req object ', StatusCodes.NOT_FOUND, false));
        }
 
        merge(req.body, { owner: req.user?.id },{logo:logoUrls})

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
        const shopDocuments = await shop.findShopsByOwnerId<string>(req.user?.id as string).limit(5).populate('owner')
        if (!shopDocuments) {
            return next(new CustomError('Now shop not found for given userid', StatusCodes.NOT_FOUND, false))
        }
        sendHTTPResponse({ res, message: { message: shopDocuments }, statusCode: StatusCodes.OK, success: true })

    } catch (error) {
        next(error)
    }
}

/**
 * Edits shops by shop id
 
 * @param req 
 * @param res 
 * @param next 
 * @returns void 
 */
export const editShop = async (
    req: GenericWithShopRequest<{}, ShopCore, Token, ShopDocument>,
    res: Response<IResponse>,
    next: NextFunction) => {
    try {
        if(req.body.logo){

        //Handles image upload 
        const options: UploadApiOptions = {
            folder: 'shop',
            gravity: 'faces',
            height: 150,
            width: 150,
            zoom: '0.6',
            crop: 'thumb'
          }
          const ImageServiceRepository = new Cloudinary()
          const imageServices = new ImageProcessingServices()
          const imageUrls = await imageServices.uploadImage(ImageServiceRepository, req.body.logo as unknown as string, options)
  
          const logoUrls = {
            id: imageUrls.public_id,
            secure_url: imageUrls.secure_url,
            url: imageUrls.url
          }
          merge(req.body,{logo:logoUrls})
        }

        const shop = new ShopRepository(shopModel)
        const shopDocument = await shop.editById<Types.ObjectId, ShopCore>(req.shop?._id, req.body)
        if (!shopDocument) {
            return next(new CustomError('Shop not found by give shopId', StatusCodes.NOT_FOUND, false))
        }

        /**
         * This function returns a modified shop object 
         */
        const result = shopFilter.sanitize<ShopDocument>(shopDocument)
        sendHTTPResponse({ res, message: { message: result }, statusCode: StatusCodes.OK, success: true })

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

