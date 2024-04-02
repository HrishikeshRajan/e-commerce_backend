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
        merge(req.body,{startTime : new Date(req.body.startTime)})
        merge(req.body,{endTime : new Date(req.body.endTime)})

        const result = await PromoModel.create(req.body)

        const response: IResponse = {
            message: { tes: result },
            success: true,
            statusCode: StatusCodes.CREATED,
            res
        }
        sendHTTPResponse(response)
    } catch (error) {

        console.log(error)
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

export const getAllPromos = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const result = await PromoModel.find({status: 'ACTIVE'})

        const response: IResponse = {
            message: { promos: result, totalPages: result.length },
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


export const updatePromoStatus = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const promo = await PromoModel.findById(req.query.promoId)
        if (!promo) throw new Error('No promo found')
        promo.status = String(req.query.status) ?? 'Pending'
        promo?.modifiedPaths()
      const s =  await promo.save()
        const response: IResponse = {
            message: {s },
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