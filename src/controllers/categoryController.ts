import categoryModel from "@models/categoryModel";
import Cloudinary from "@repositories/ImageProcessing.repository";
import { CategoryRepo } from "@repositories/category.repository";
import { ImageProcessingServices } from "@services/image.processing.services";
import { sendHTTPResponse } from "@services/response.services";
import CustomError from "@utils/CustomError";
import { convertToBase64 } from "@utils/image.helper";
import { UploadApiOptions } from "cloudinary";
import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { merge } from "lodash";
import { IResponse } from "types/IResponse.interfaces";

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //Handles image upload 
        const options: UploadApiOptions = {
            folder: 'category',
            gravity: 'auto',
            zoom: '0.6',
            crop: 'fill'
        }
        const base64: string | undefined = convertToBase64(req)
        const ImageServiceRepository = new Cloudinary()
        const imageServices = new ImageProcessingServices()
        const imageUrls = await imageServices.uploadImage(ImageServiceRepository, base64!, options)

        const logoUrls = {
            secure_url: imageUrls.secure_url,
        }
        merge(req.body, { image: logoUrls })


        const category = new CategoryRepo(categoryModel)
        const result = await category.create(req.body)
        const response: IResponse = { res, message: { category: result }, statusCode: StatusCodes.OK, success: true }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const categoryRepo = new CategoryRepo(categoryModel)

        if (req.files) {
            //Handles image upload 
            const options: UploadApiOptions = {
                folder: 'category',
                gravity: 'auto',
                zoom: '0.6',
                crop: 'fill'
            }
            const base64: string | undefined = convertToBase64(req)
            const ImageServiceRepository = new Cloudinary()
            const imageServices = new ImageProcessingServices()
            const imageUrls = await imageServices.uploadImage(ImageServiceRepository, base64!, options)

            const imageUrl = {
                secure_url: imageUrls.secure_url,
            }
            merge(req.body, { image: imageUrl })

        }

        const result = await categoryRepo.edit(req.params.catId, req.body)

        const response: IResponse = { res, message: { category: result }, statusCode: StatusCodes.OK, success: true }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const categoryRepo = new CategoryRepo(categoryModel)
        const result = await categoryRepo.delete(req.params.catId)

        const response: IResponse = { res, message: { category: result }, statusCode: StatusCodes.OK, success: true }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const categoryRepo = new CategoryRepo(categoryModel)
        const result = await categoryRepo.getAll()

        const response: IResponse = { res, message: { categories: result }, statusCode: StatusCodes.OK, success: true }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}