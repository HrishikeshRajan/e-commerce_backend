import { sendHTTPResponse } from "../services/response.services"
import CustomError from "../utils/CustomError"
import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { IResponse } from "types/IResponse.interfaces"


export const addAuthBackground = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {


        const authBackground = {
            authBackgroundImage: {
                url: {
                    big: '',
                    small: ''
                }
            }
        }
        const response: IResponse = { res, message: { authBackground }, statusCode: StatusCodes.OK, success: true }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}
export const getAuthBackground = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {


        const authBackground = {
            authBackgroundImage: {
                url: {
                    big: '',
                    small: ''
                }
            }
        }
        const response: IResponse = { res, message: { authBackground }, statusCode: StatusCodes.OK, success: true }
        sendHTTPResponse(response)
    } catch (error: unknown) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}