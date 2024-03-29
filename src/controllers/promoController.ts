import PromoModel from "@models/promoModel"
import Cloudinary from "@repositories/ImageProcessing.repository"
import { ImageProcessingServices } from "@services/image.processing.services"
import { sendHTTPResponse } from "@services/response.services"
import CustomError from "@utils/CustomError"
import { convertToBase64 } from "@utils/image.helper"
import { UploadApiResponse, UploadApiOptions } from "cloudinary"
import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { merge } from "lodash"
import mongoose, { MongooseError } from "mongoose"
import { Method, Status } from "types/CouponManagement"
import { IResponse } from "types/IResponse.interfaces"
const handleImageUpload = async (req: Request): Promise<UploadApiResponse> => {
    const options: UploadApiOptions = {
        folder: 'offers',
        gravity: 'auto',
    }
    const base64: string | undefined = convertToBase64(req)
    const ImageServiceRepository = new Cloudinary()
    const imageServices = new ImageProcessingServices()
    const imageUrls: UploadApiResponse = await imageServices.uploadImage(ImageServiceRepository, base64 as string, options)
    return imageUrls
}

export const create = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const secure_url = await handleImageUpload(req)
        const url = (await secure_url).secure_url

        req.body.status = req.body.status
        merge(req.body, { banner: { secure_url: url } })

        merge(req.body, { tags: JSON.parse(req.body.tags) })

        const result = await PromoModel.create(req.body)

        const response: IResponse = {
            message: { tes: result },
            success: true,
            statusCode: StatusCodes.CREATED,
            res
        }
        sendHTTPResponse(response)
    } catch (error) {
        if (error instanceof Error) {
            return next(new CustomError('Invalid Promo Cdoe', StatusCodes.CONFLICT, false))
        }
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

export const get = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const methodMap: Record<string, string> = {
            'coupon': Method.COUPON,
            'voucher': Method.VOUCHER
        }

        const result = await PromoModel.find({
            method: methodMap[req.query.method as string],
        })

        const response: IResponse = {
            message: { tes: result },
            success: true,
            statusCode: StatusCodes.OK,
            res
        }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        console.log(error)
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
