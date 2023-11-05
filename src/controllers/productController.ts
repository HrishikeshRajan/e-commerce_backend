// import { type UploadApiOptions, type UploadApiResponse } from 'cloudinary'
import { type Request, type Response, type NextFunction } from 'express'
// import Cloudinary from '../repository/ImageProcessing.repository'
import CustomError from '../utils/CustomError'
// import { type CustomRequest } from '../types'
// import { convertToBase64, convertToBase64Array, multerUpload, multerUploadArray } from '../utils/image.helper'
import { sendHTTPResponse } from '../services/response.services'
import ProductsRepository from '../repository/product.repository'
import ProductServicess from '../services/product.services'
// import _ from 'lodash'
// import { type Photo, type UploadedFile } from '../types/product'
// import { ImageProcessingServices } from '../services/image.processing.services'
// import { imageUrl } from '../types/cloudinary.interfaces'
import ProductModel from '../models/productModel'
import { type IResponse } from '../types/IResponse.interfaces'
import { StatusCodes } from 'http-status-codes'

const productRepository = new ProductsRepository(ProductModel)
const productServices = new ProductServicess()

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body.gender = parseInt(req.body.gender)
    req.body.sizes = [...req.body.sizes.split(',')]

    const product = await productServices.creatProduct(productRepository, req.body)
    const response: IResponse = {
      res,
      message: { product },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

// create coupon
// delete coupon
// edit coupon

// give coupon to specific user only
// give coupon based on purchase per month
// give coupn based on money send on 3 months

// add discount
// edit discount
