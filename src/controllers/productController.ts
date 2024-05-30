
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
import { isEmpty, merge, uniqueId, values } from 'lodash'
import { productFilter } from '@utils/product.helper'
import CustomError from '@utils/CustomError'
import SearchEngine from '@utils/SearchEngine'
import logger from '@utils/LoggerFactory/Logger'
import { convertToBase64Array } from '@utils/image.helper'
import { ProductIdsSchemaType, ProductSchemaType } from 'types/zod/product.schemaTypes'
import { getSortValue } from '@utils/getSortValue'
import PromoModel from '@models/promoModel'
import FlashSale from '@models/flashSale.model'
import { FilterQuery, Types } from 'mongoose'
import ProductServices from '@services/product.services'
import { getFromCache, setToCache } from '@utils/Cache'
import { Status } from 'types/CouponManagement'



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

    merge(req.body, { sellerId: req.user?.id }, { images: images }, { isDiscontinued: Boolean(req.body.isDiscontinued) }, { stock: parseInt(req.body.stock) })

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
 * Finds single document
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const singleProduct = async (
  req: GenericRequest<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    const singleProduct = await productRepo.getSingleProduct<string>(req.params.id)

    if (!singleProduct) {
      return next(new CustomError('No product found that owned by your seller id', StatusCodes.INTERNAL_SERVER_ERROR, false))
    }

    const currentDate = new Date()
    const flashsale = await FlashSale.findOne({
      product: req.params.id,
      endTime: { $gt: currentDate },
      status: 'Active'
    })

    const promos = await PromoModel.find({
      'tags.products': req.params.id,
      method: 'COUPON',
      'status': Status.ACTIVE
    })


    type ProductResponse = {
      product: ProductDocument,
      offers?: Record<any, any>
    }
    const responseObject: ProductResponse = {
      product: singleProduct
    }
    responseObject.offers = {};

    if (promos) {
      responseObject.offers.coupons = promos
    }
    if (flashsale) {
      responseObject.offers.flashsale = flashsale
    }
    const response: IResponse = {
      res,
      message: responseObject,
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
  req: GenericRequest<{ id: string }, {}, Token>,
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



/**
 * API ACCESS: seller
 * Query the products based on category
 */
export const queryProducts = async (
  req: GenericRequestWithQuery<{}, { [key: string]: string | undefined }, {}, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    const productServices = new ProductServices()

    if (!req.query.page) {
      req.query.page = '1'
    }
    const resultPerPage = 10
    const query = { ...req.query }

    const copyQuery = { ...req.query }

    delete copyQuery.page
    delete copyQuery.sort
    delete copyQuery.limit

    let copyQueryString = JSON.stringify(copyQuery)
    copyQueryString = copyQueryString.replace(/\b(lt|lte|gt|gte)\b/g, ((val) => `$${val}`))
    const queryObject = JSON.parse(copyQueryString)

    const totalAvailableProducts = await productServices.countTotalProductsByQuery(productRepo, queryObject)
 
    const searchEngine = new SearchEngine<ProductDocument, ProductQuery>(ProductModel, query).search().filter().sort().pager(resultPerPage, totalAvailableProducts)
    if (typeof searchEngine === 'number') {
      const response: IResponse = {
        res,
        message: { products: [] },
        statusCode: StatusCodes.OK,
        success: true
      }
      return sendHTTPResponse(response)
    }

    //Resolving the mongoose promise
    const productQuery = searchEngine.query
    const [products] = await Promise.all([productQuery])
    if (isEmpty(products)) {
      return next(new CustomError('No products found', StatusCodes.NOT_FOUND, false))
    }

    const totalPages = Math.ceil(totalAvailableProducts / resultPerPage)

    // res.setHeader('Cache-Control', 'private, max-age=60000, must-validate');
    const response: IResponse = {
      res,
      message: { products: products, brandsCount: [], page: req.query.page, totalPages, itemsShowing: products?.length, totalItems: totalAvailableProducts },
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
 * API ACCESS: User
 * Send category strings
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const getCategories = async (
  req: GenericRequestWithQuery<{}, { [key: string]: string | undefined }, {}, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    const productService = new ProductServices()

    const cachedData = getFromCache('category')
    //Early return
    if (cachedData) {
      const response: IResponse = {
        res,
        message: { categories: cachedData },
        statusCode: StatusCodes.OK,
        success: true
      }
      return sendHTTPResponse(response)
    }
    const categories = await productService.getCategory(productRepo)
    setToCache('category', categories, 300)
    const response: IResponse = {
      res,
      message: { categories },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)
  } catch (error) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

/**
 * API ACCESS: User
 * Send filter options
 * @param GenericRequest 
 * @param res 
 * @param next 
 * @returns void
 */
export const getFilterOptions = async (
  req: GenericRequestWithQuery<{}, { category: string }, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productRepo = new ProductRepo<ProductDocument>(ProductModel)
    const productService = new ProductServices()



    const query = req.query as FilterQuery<{ category: string }>

    const brands = await productService.getBrandNames(productRepo, query)
    const updateWithBrandState = brands.map((val, index) => ({
      id: index + 1,
      name: val,
      checked: false,
    }));

    const colors = await productService.getColors(productRepo, query)
    const updateWithColorState = colors.map((val, index) => ({
      id: index + 1,
      name: val,
      checked: false,
    }));


     type FilterValues = { name: string, id: number, checked: boolean };
     type FilterBoxItem = {
      id: string;
      title: string;
      values: Array<FilterValues>
      key: string
    };

    const optionsKey = [{title:'brands', key:'brand', values:updateWithBrandState},{title:'colors',key:'color', values:updateWithColorState}]
     const responseData:Array<FilterBoxItem> = []

     
      for(let op of optionsKey){
        const option:FilterBoxItem = {
          id: uniqueId('cat'),
          title: op.title,
          values: op.values ,
          key: op.key
        }
        responseData.push(option)
      }

      // res.setHeader('Cache-Control','public, max-age=86400000')

    const response: IResponse = {
      res,
      message: { filters: responseData },
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
 * handles a general search on products
 */
export const searchProducts = async (
  req: GenericRequestWithQuery<{}, { [key: string]: string | undefined }, {}, Token>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const productRepo = new ProductRepo<ProductDocument>(ProductModel)

    if (!req.query.page) {
      req.query.page = '1'
    }
    const resultPerPage = 20
    const query = { ...req.query }

    const copyQuery = { ...req.query }

    delete copyQuery.page
    delete copyQuery.sort
    delete copyQuery.limit

    let copyQueryString = JSON.stringify(copyQuery)
    copyQueryString = copyQueryString.replace(/\b(lt|lte|gt|gte)\b/g, ((val) => `$${val}`))
    const queryObject = JSON.parse(copyQueryString)

    const totalAvailableProducts = await productRepo.countTotalProductsByQuery(queryObject)

    const searchEngine = new SearchEngine<ProductDocument, ProductQuery>(ProductModel, query).search().filter().sort().pager(resultPerPage, totalAvailableProducts)

    if (typeof searchEngine === 'number') {
      const response: IResponse = {
        res,
        message: { products: [] },
        statusCode: StatusCodes.OK,
        success: true
      }
      return sendHTTPResponse(response)
    }

    //Resolving the mongoose promise
    const productQuery = searchEngine.query
    const products = await productQuery
    if (isEmpty(products)) {
      const response: IResponse = {
        res,
        message: { products: [], page: req.query.page, totalPages: 0, itemsShowing: products?.length, totalItems: totalAvailableProducts },
        statusCode: StatusCodes.OK,
        success: false
      }
      return sendHTTPResponse(response)
    }
    const totalPages = Math.ceil(totalAvailableProducts / resultPerPage)
    const response: IResponse = {
      res,
      message: { products: products, page: req.query.page, totalPages, itemsShowing: products?.length, totalItems: totalAvailableProducts },
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
