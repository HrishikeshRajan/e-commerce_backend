
//types
import { type Response, type NextFunction } from 'express'
import { type IResponse } from '../types/IResponse.interfaces'
import {type GenericRequest, type Token } from 'types/IUser.interfaces'
import { ProductDocument, type ProductCore } from 'types/product'
import { imageUrl } from 'types/cloudinary.interfaces'

//Repos
import { ProductRepo } from '@repositories/product.repository'
import Cloudinary from '@repositories/ImageProcessing.repository'
import { UploadApiOptions, UploadApiResponse } from 'cloudinary'

//services
import { sendHTTPResponse } from '@services/response.services'
import { ImageProcessingServices } from '@services/image.processing.services'

//models
import ProductModel from '@models/productModel'

//utils
import { StatusCodes } from 'http-status-codes'
import { isEmpty, merge } from 'lodash'
import { convertToBase64 } from '@utils/image.helper'
import { productFilter } from '@utils/product.helper'
import CustomError from '@utils/CustomError'



export const add = async (
  req: GenericRequest<{}, ProductCore, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (isEmpty(req.user)) {
      return next(new CustomError('User not found in req.user', StatusCodes.INTERNAL_SERVER_ERROR, false))

    }
    const options: UploadApiOptions = {
      folder: 'Products',
      gravity: 'faces',
      height: 150,
      width: 150,
      zoom: '0.6',
      crop: 'thumb'
    }
    const base64: string | undefined = convertToBase64(req)
    const ImageServiceRepository = new Cloudinary()
    const imageServices = new ImageProcessingServices()

    const imageUrls: UploadApiResponse = await imageServices.uploadImage(ImageServiceRepository, base64 as string, options)
    const photoUrls: imageUrl = {
      publicId: imageUrls.public_id,
      secureUrl: imageUrls.secure_url,
      url: imageUrls.url
    }

    const productRepo = new ProductRepo<ProductDocument>(ProductModel)

    //Updates the req.body with new values
    merge(req.body, { sellerId: req.user.id }, { image: photoUrls })

    const product = await productRepo.create<ProductCore>(req.body)

    const response: IResponse = {
      res,
      message: { product: productFilter.sanitize(product)},
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
