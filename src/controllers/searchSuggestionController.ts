import { ProductRepo } from "@repositories/product.repository"
import CustomError from "@utils/CustomError"
import {type Request, type Response, type NextFunction } from "express"
import { ProductDocument } from "types/product.interface"
import ProductModel from '@models/productModel'
import { StatusCodes } from "http-status-codes"
import { IResponse } from "types/IResponse.interfaces"
import { sendHTTPResponse } from "@services/response.services"

/**
 * API ACCESS: User
 * Sends keywords for suggestions
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */
export const getSearchSuggestions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => { 
    try {
  
        const uniqueCategories = await ProductModel.distinct('category', { $text: { $search: req.query?.search as string } }); 
 
        const response: IResponse = {
            res,
            message: { suggestions: uniqueCategories },
            statusCode: StatusCodes.OK,
            success: true
        }
        sendHTTPResponse(response)

    } catch (error: any) {
        const errorObj = error as CustomError
        next(new CustomError(errorObj.message, errorObj.code, false))
    }
}

 