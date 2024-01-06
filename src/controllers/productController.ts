
//types
import { type Response, type NextFunction } from 'express'
import { type IResponse } from '../types/IResponse.interfaces'
import { type GenericRequest, type Token } from 'types/IUser.interfaces'
import { type ProductDocument, type ProductCore } from 'types/product.interface'
import { type imageUrl } from 'types/cloudinary.interfaces'
import { type GenericRequestWithQuery, type ProductQuery } from 'types/IProduct.interface'
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
import { productFilter } from '@utils/product.helper'
import CustomError from '@utils/CustomError'
import SearchEngine from '@utils/SearchEngine'
import Logger from '@utils/LoggerFactory/LoggerFactory'
import { convertToBase64Array } from '@utils/image.helper'
import { ProductIdsSchemaType, ProductSchemaType } from 'types/zod/product.schemaTypes'
const logger = Logger()



/**
 * API ACCESS: seller
 * Create new product document
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const add = async (
  req: GenericRequest<{}, ProductSchemaType, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const options: UploadApiOptions = {
      folder: 'Products',
      gravity: 'faces',
      height: 150,
      width: 150,
      zoom: '0.6',
      crop: 'thumb'
    }
    logger.info('Starting image upload process...');

    const base64Array: string[] | undefined = convertToBase64Array(req.files)

    const ImageServiceRepository = new Cloudinary()
    const imageServices = new ImageProcessingServices()


    const imageUrlArray = await imageServices.uploadMultipleImages(ImageServiceRepository, base64Array, options)
    logger.info('Image uploaded successfully.')

    const images = imageUrlArray.map(({ url, secure_url }) => ({ url, secure_url }))
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)

    //Updates the req.body with new values

    merge(req.body, { sellerId: req.user?.id }, { images: images },{isDiscontinued :Boolean(req.body.isDiscontinued) },{stock:parseInt(req.body.stock)})

    logger.info('Creating product...')
    const product = await productRepo.create<ProductSchemaType>(req.body)
    logger.info('Product created successfully.')
    const response: IResponse = {
      res,
      message: { product: productFilter.sanitize(product) },
      statusCode: StatusCodes.OK,
      success: true
    }
    logger.info('Response send successfully.')
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    logger.error(`${error.message}, statusode: ${errorObj.code}`)
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * API ACCESS: seller
 * Updates the product owned by seller id
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const update = async (
  req: GenericRequest<{ productId: string }, ProductCore, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const options: UploadApiOptions = {
      folder: 'Products',
      gravity: 'faces',
      height: 150,
      width: 150,
      zoom: '0.6',
      crop: 'thumb'
    }
    logger.info('Starting image upload process...');

    const base64Array: string[] | undefined = convertToBase64Array(req.files)

    const ImageServiceRepository = new Cloudinary()
    const imageServices = new ImageProcessingServices()


    const imageUrlArray = await imageServices.uploadMultipleImages(ImageServiceRepository, base64Array, options)
    logger.info('Image uploaded successfully.')

    const images = imageUrlArray.map(({ url, secure_url }) => ({ url, secure_url }))
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)

    const product = await productRepo.getProductById<string>(req.params.productId, req.user?.id as string)

    if (!product) {
      return next(new CustomError('No product found that owned by your seller id', StatusCodes.INTERNAL_SERVER_ERROR, false))
    }

    //Updates the req.body.image base64 string with corresponding cloudinary urls
    merge(req.body, { sellerId: req.user?.id }, { images: images })

    const updatedProduct = await productRepo.updateProduct<ProductDocument, ProductCore>(product, req.body)

    const response: IResponse = {
      res,
      message: { product: productFilter.sanitize(updatedProduct) },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * API ACCESS: seller
 * Delete product by product and seller ids
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const deleteProduct = async (
  req: GenericRequest<{ productId: string }, ProductCore, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (isEmpty(req.user)) {
      return next(new CustomError('User not found in req.user', StatusCodes.INTERNAL_SERVER_ERROR, false))

    }

    const productRepo = new ProductRepo<ProductDocument>(ProductModel)

    const deletedProduct = await productRepo.deleteProductById<string>(req.params.productId, req.user.id)

    if (!deletedProduct) {
      return next(new CustomError('No product found that owned by your seller id', StatusCodes.INTERNAL_SERVER_ERROR, false))
    }

    const response: IResponse = {
      res,
      message: { product: deletedProduct },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * API ACCESS: seller
 * Delete the products by seller and products ids
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const deleteProducts = async (
  req: GenericRequest<{}, ProductIdsSchemaType, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info(`Initiating bulk product deletion, Seller ID: ${req.user?.id}`)
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    logger.info(`Bulk product deletion process started`)
    const deletedProduct = await productRepo.deleteProductsByIds<string>(req.body.productsIds)
  
    logger.info(`Verifying products deletion result`)

    if (!deletedProduct.deletedCount) {
      logger.error(`No products documents found for deletion, Seller ID: ${req.user?.id}`)
      return next(new CustomError('No product found that owned by your seller id', StatusCodes.INTERNAL_SERVER_ERROR, false))
    }
    logger.info(`Products deletion successfull`)
    const response: IResponse = {
      res,
      message: { product: deletedProduct },
      statusCode: StatusCodes.OK,
      success: true
    }
    logger.info(`Response sent to Seller ID: ${req.user?.id}`);
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    logger.error(`Error occurred in deleteProducts: ${errorObj.message}. Seller ID: ${req.user?.id}`);
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}
/**
 * API ACCESS: seller
 * Query the products owned by seller id as default
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const queryProductsBySellerId = async (
  req: GenericRequestWithQuery<{}, { [key: string]: string | undefined }, {}, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (isEmpty(req.user)) {
      return next(new CustomError('User not found in req.user', StatusCodes.NOT_FOUND, false))
    }
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    const totalAvailableProducts = await productRepo.countTotalProductsBySellerId<string>(req.user.id)
    const resultPerPage = parseInt((req.query?.limit ? req.query.limit : 10) as string)

    const query = { sellerId: req.user.id, ...req.query }

    const searchEngine = new SearchEngine<ProductDocument, ProductQuery>(ProductModel, query).search().filter().pager(resultPerPage, totalAvailableProducts)
    if (typeof searchEngine === 'number') {
      return next(new CustomError('No more products', StatusCodes.OK, false))
    }

    //Resolving the  mongoose promise
    const products = await searchEngine.query?.populate('sellerId', '_id fullname').populate('shopId', '_id name').select('name _id createdAt price stock shopId sellerId')

    if (isEmpty(products)) {
      return next(new CustomError('No product found that owned by your seller id', StatusCodes.NOT_FOUND, false))
    }

    const response: IResponse = {
      res,
      message: { products: products, itemsShowing: products?.length, totalItems: totalAvailableProducts },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}


/**
 * API ACCESS: seller
 * Get product by product Id
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const getProductById = async (
  req: GenericRequest<{ id: string },{}, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const productRepo = new ProductRepo<ProductDocument>(ProductModel)

    const isProduct = await productRepo.getProductById<string>(req.params.id, req.user?.id as string)

    if (isEmpty(isProduct)) {
      return next(new CustomError('No product found that owned by the seller id', StatusCodes.NOT_FOUND, false))
    }

    const response: IResponse = {
      res,
    message: { product: productFilter.sanitize(isProduct) },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}


/**
 * API ACCESS: seller
 * Query the products shop by seller id as default
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const queryProductsByShopId = async (
  req: GenericRequestWithQuery<{}, { [key: string]: string | undefined }, {}, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (isEmpty(req.user)) {
      return next(new CustomError('User not found in req.user', StatusCodes.NOT_FOUND, false))

    }
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    const totalAvailableProducts = await productRepo.countTotalProductsBySellerId<string>(req.user.id)
    const resultPerPage = 5

    const query = { sellerId: req.user.id, ...req.query }
    const searchEngine = new SearchEngine<ProductDocument, ProductQuery>(ProductModel, query).customSearch().filter().pager(resultPerPage, totalAvailableProducts)
    if (typeof searchEngine === 'number') {
      return next(new CustomError('No more products', StatusCodes.OK, false))
    }

    //Resolving the mongoose promise
    const products = await searchEngine.query
    if (isEmpty(products)) {
      return next(new CustomError('No product found that owned by your seller id', StatusCodes.NOT_FOUND, false))
    }

    const response: IResponse = {
      res,
      message: { product: products, itemsShowing: products?.length, totalItems: totalAvailableProducts },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error: any) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}



// /**
//  * test code
//  * @param req 
//  * @param res 
//  */
// export const testQuery = async (
//   req: GenericRequestWithQuery<{}, { [key: string]: string | undefined }, {}, {}>,
//   res: Response
// ) => {
//   const query = req.query
//   const searchEngine = new SearchEngine(productModel, query).search().filter().pager(5)
//   const result = await (await searchEngine).query?.clone()

//   res.json({ result, count: result?.length })
// }

// create coupon
// delete coupon
// edit coupon

// give coupon to specific user only
// give coupon based on purchase per month
// give coupn based on money send on 3 months

// add discount
// edit discount
