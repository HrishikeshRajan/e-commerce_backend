import PromoModel from "@models/promoModel"
import { sendHTTPResponse } from "@services/response.services"
import CustomError from "@utils/CustomError"
import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { IResponse } from "types/IResponse.interfaces"

export const create = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {


        req.body.banner = 'https://res.cloudinary.com/dxv2tmvfw/image/upload/v1710495002/offers/s0zqyfnstdyeeaojhelq.png'  
        const result = await PromoModel.create(req.body)

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

export const get = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {


       
        const result = await PromoModel.findOne({
            type:req.body.method,
            status:'Active',

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
