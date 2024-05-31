import { ProductRepo } from "../repository/product.repository"
import CustomError from "../utils/CustomError"
import { type Request, type Response, type NextFunction } from "express"
import { ProductDocument } from "types/product.interface"
import ProductModel from '../models/productModel'
import { StatusCodes } from "http-status-codes"
import { IResponse } from "types/IResponse.interfaces"
import { sendHTTPResponse } from "../services/response.services"
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js'
import NodeCache from "node-cache"
import ProductServices from "../services/product.services"

const nodeCache = new NodeCache();

/**
 * First checks on cache if not then fetch from database
 * 
 * @param repo 
 * @param productServce 
 * @returns unique names and its frequency
 */
async function getItems(repo: ProductRepo<ProductDocument>, productServce: ProductServices) {
  let cachedNames = nodeCache.get("names") as string[];
  if (cachedNames) {
    return cachedNames
  }
  let result = await productServce.getUniqueProductNames(repo)
  nodeCache.set('names', result, 300)
  return result

}

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
    const productRepo = new ProductRepo(ProductModel)
    const productService = new ProductServices()
    let items = await getItems(productRepo, productService)
    const options: IFuseOptions<any> = {
      useExtendedSearch: true,
      keys: ['name']
    }

    if (!items) {
      const response: IResponse = {
        res,
        message: { suggestions: [] },
        statusCode: StatusCodes.OK,
        success: true
      }
      return sendHTTPResponse(response)
    }

    const fuse = new Fuse(items, options)
    const result = fuse.search(req.query.name as string)
    const selectedSuggestions: FuseResult<any>[] = result.splice(1, 5)


    const response: IResponse = {
      res,
      message: { suggestions: selectedSuggestions },
      statusCode: StatusCodes.OK,
      success: true
    }
    sendHTTPResponse(response)

  } catch (error) {
    const errorObj = error as CustomError
    next(new CustomError(errorObj.message, errorObj.code, false))
  }
}

