"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.getFilterOptions = exports.getCategories = exports.queryProducts = exports.queryProductsByShopId = exports.getProductById = exports.queryProductsBySellerId = exports.deleteProducts = exports.singleProduct = exports.deleteProduct = exports.update = exports.add = void 0;
//Repos
const product_repository_1 = require("@repositories/product.repository");
const ImageProcessing_repository_1 = __importDefault(require("@repositories/ImageProcessing.repository"));
//services
const response_services_1 = require("@services/response.services");
const image_processing_services_1 = require("@services/image.processing.services");
//models
const productModel_1 = __importDefault(require("@models/productModel"));
//utils
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const product_helper_1 = require("@utils/product.helper");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const SearchEngine_1 = __importDefault(require("@utils/SearchEngine"));
const Logger_1 = __importDefault(require("@utils/LoggerFactory/Logger"));
const image_helper_1 = require("@utils/image.helper");
const promoModel_1 = __importDefault(require("@models/promoModel"));
const flashSale_model_1 = __importDefault(require("@models/flashSale.model"));
const mongoose_1 = require("mongoose");
const product_services_1 = __importDefault(require("@services/product.services"));
const Cache_1 = require("@utils/Cache");
/**
 * API ACCESS: seller
 * Create new product document
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const add = async (req, res, next) => {
    try {
        const options = {
            folder: 'Products',
            gravity: 'faces',
            height: 150,
            width: 150,
            zoom: '0.6',
            crop: 'thumb'
        };
        Logger_1.default.info('Starting image upload process...');
        const base64Array = (0, image_helper_1.convertToBase64Array)(req.files);
        const ImageServiceRepository = new ImageProcessing_repository_1.default();
        const imageServices = new image_processing_services_1.ImageProcessingServices();
        const imageUrlArray = await imageServices.uploadMultipleImages(ImageServiceRepository, base64Array, options);
        Logger_1.default.info('Image uploaded successfully.');
        const images = imageUrlArray.map(({ url, secure_url }) => ({ url, secure_url }));
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        //Updates the req.body with new values
        (0, lodash_1.merge)(req.body, { sellerId: req.user?.id }, { images: images }, { isDiscontinued: Boolean(req.body.isDiscontinued) }, { stock: parseInt(req.body.stock) });
        Logger_1.default.info('Creating product...');
        const product = await productRepo.create(req.body);
        Logger_1.default.info('Product created successfully.');
        const response = {
            res,
            message: { product: product_helper_1.productFilter.sanitize(product) },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        Logger_1.default.info('Response send successfully.');
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.error(`${error.message}, statusode: ${errorObj.code}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.add = add;
/**
 * API ACCESS: seller
 * Updates the product owned by seller id
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const update = async (req, res, next) => {
    try {
        const options = {
            folder: 'Products',
            gravity: 'faces',
            height: 150,
            width: 150,
            zoom: '0.6',
            crop: 'thumb'
        };
        Logger_1.default.info('Starting image upload process...');
        const base64Array = (0, image_helper_1.convertToBase64Array)(req.files);
        const ImageServiceRepository = new ImageProcessing_repository_1.default();
        const imageServices = new image_processing_services_1.ImageProcessingServices();
        const imageUrlArray = await imageServices.uploadMultipleImages(ImageServiceRepository, base64Array, options);
        Logger_1.default.info('Image uploaded successfully.');
        const images = imageUrlArray.map(({ url, secure_url }) => ({ url, secure_url }));
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const product = await productRepo.getProductById(req.params.productId, req.user?.id);
        if (!product) {
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        //Updates the req.body.image base64 string with corresponding cloudinary urls
        (0, lodash_1.merge)(req.body, { sellerId: req.user?.id }, { images: images });
        const updatedProduct = await productRepo.updateProduct(product, req.body);
        const response = {
            res,
            message: { product: product_helper_1.productFilter.sanitize(updatedProduct) },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.update = update;
/**
 * API ACCESS: seller
 * Delete product by product and seller ids
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const deleteProduct = async (req, res, next) => {
    try {
        if ((0, lodash_1.isEmpty)(req.user)) {
            return next(new CustomError_1.default('User not found in req.user', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const deletedProduct = await productRepo.deleteProductById(req.params.productId, req.user.id);
        if (!deletedProduct) {
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        const response = {
            res,
            message: { product: deletedProduct },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteProduct = deleteProduct;
/**
 * API ACCESS: seller
 * Finds single document
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const singleProduct = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const singleProduct = await productRepo.getSingleProduct(req.params.id);
        if (!singleProduct) {
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        const currentDate = new Date();
        const flashsale = await flashSale_model_1.default.findOne({
            product: req.params.id,
            endTime: { $gt: currentDate },
            status: 'Active'
        });
        const promos = await promoModel_1.default.find({
            'tags.products': new mongoose_1.Types.ObjectId(req.params.id),
            method: 'COUPON',
            'status': "ACTIVE" /* Status.ACTIVE */
        });
        const responseObject = {
            product: singleProduct
        };
        responseObject.offers = {};
        if (promos) {
            responseObject.offers.coupons = promos;
        }
        if (flashsale) {
            responseObject.offers.flashsale = flashsale;
        }
        const response = {
            res,
            message: responseObject,
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.singleProduct = singleProduct;
/**
 * API ACCESS: seller
 * Delete the products by seller and products ids
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const deleteProducts = async (req, res, next) => {
    try {
        Logger_1.default.info(`Initiating bulk product deletion, Seller ID: ${req.user?.id}`);
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        Logger_1.default.info(`Bulk product deletion process started`);
        const deletedProduct = await productRepo.deleteProductsByIds(req.body.productsIds);
        Logger_1.default.info(`Verifying products deletion result`);
        if (!deletedProduct.deletedCount) {
            Logger_1.default.error(`No products documents found for deletion, Seller ID: ${req.user?.id}`);
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        Logger_1.default.info(`Products deletion successfull`);
        const response = {
            res,
            message: { product: deletedProduct },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        Logger_1.default.info(`Response sent to Seller ID: ${req.user?.id}`);
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        Logger_1.default.error(`Error occurred in deleteProducts: ${errorObj.message}. Seller ID: ${req.user?.id}`);
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteProducts = deleteProducts;
/**
 * API ACCESS: seller
 * Query the products owned by seller id as default
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const queryProductsBySellerId = async (req, res, next) => {
    try {
        if ((0, lodash_1.isEmpty)(req.user)) {
            return next(new CustomError_1.default('User not found in req.user', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const totalAvailableProducts = await productRepo.countTotalProductsBySellerId(req.user.id);
        const resultPerPage = parseInt((req.query?.limit ? req.query.limit : 10));
        const query = { sellerId: req.user.id, ...req.query };
        const searchEngine = new SearchEngine_1.default(productModel_1.default, query).search().filter().pager(resultPerPage, totalAvailableProducts);
        if (typeof searchEngine === 'number') {
            return next(new CustomError_1.default('No more products', http_status_codes_1.StatusCodes.OK, false));
        }
        //Resolving the  mongoose promise
        const products = await searchEngine.query?.populate('sellerId', '_id fullname').populate('shopId', '_id name').select('name _id createdAt price stock shopId sellerId');
        if ((0, lodash_1.isEmpty)(products)) {
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const response = {
            res,
            message: { products: products, itemsShowing: products?.length, totalItems: totalAvailableProducts },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.queryProductsBySellerId = queryProductsBySellerId;
/**
 * API ACCESS: seller
 * Get product by product Id
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const getProductById = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const isProduct = await productRepo.getProductById(req.params.id, req.user?.id);
        if ((0, lodash_1.isEmpty)(isProduct)) {
            return next(new CustomError_1.default('No product found that owned by the seller id', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const response = {
            res,
            message: { product: product_helper_1.productFilter.sanitize(isProduct) },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getProductById = getProductById;
/**
 * API ACCESS: seller
 * Query the products shop by seller id as default
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const queryProductsByShopId = async (req, res, next) => {
    try {
        if ((0, lodash_1.isEmpty)(req.user)) {
            return next(new CustomError_1.default('User not found in req.user', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const totalAvailableProducts = await productRepo.countTotalProductsBySellerId(req.user.id);
        const resultPerPage = 5;
        const query = { sellerId: req.user.id, ...req.query };
        const searchEngine = new SearchEngine_1.default(productModel_1.default, query).customSearch().filter().pager(resultPerPage, totalAvailableProducts);
        if (typeof searchEngine === 'number') {
            return next(new CustomError_1.default('No more products', http_status_codes_1.StatusCodes.OK, false));
        }
        //Resolving the mongoose promise
        const products = await searchEngine.query;
        if ((0, lodash_1.isEmpty)(products)) {
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const response = {
            res,
            message: { product: products, itemsShowing: products?.length, totalItems: totalAvailableProducts },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.queryProductsByShopId = queryProductsByShopId;
/**
 * API ACCESS: seller
 * Query the products based on category
 */
const queryProducts = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productServices = new product_services_1.default();
        if (!req.query.page) {
            req.query.page = '1';
        }
        const resultPerPage = 20;
        const query = { ...req.query };
        const copyQuery = { ...req.query };
        delete copyQuery.page;
        delete copyQuery.sort;
        delete copyQuery.limit;
        let copyQueryString = JSON.stringify(copyQuery);
        copyQueryString = copyQueryString.replace(/\b(lt|lte|gt|gte)\b/g, ((val) => `$${val}`));
        const queryObject = JSON.parse(copyQueryString);
        const totalAvailableProducts = await productServices.countTotalProductsByQuery(productRepo, queryObject);
        const searchEngine = new SearchEngine_1.default(productModel_1.default, query).search().filter().sort().pager(resultPerPage, totalAvailableProducts);
        if (typeof searchEngine === 'number') {
            const response = {
                res,
                message: { products: [] },
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        //Resolving the mongoose promise
        const productQuery = searchEngine.query;
        const [products] = await Promise.all([productQuery]);
        if ((0, lodash_1.isEmpty)(products)) {
            return next(new CustomError_1.default('No products found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const totalPages = Math.ceil(totalAvailableProducts / resultPerPage);
        const response = {
            res,
            message: { products: products, brandsCount: [], page: req.query.page, totalPages, itemsShowing: products?.length, totalItems: totalAvailableProducts },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.queryProducts = queryProducts;
/**
 * API ACCESS: User
 * Send category strings
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const getCategories = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productService = new product_services_1.default();
        const cachedData = (0, Cache_1.getFromCache)('category');
        //Early return
        if (cachedData) {
            const response = {
                res,
                message: { categories: cachedData },
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        const categories = await productService.getCategory(productRepo);
        (0, Cache_1.setToCache)('category', categories, 300);
        const response = {
            res,
            message: { categories },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getCategories = getCategories;
/**
 * API ACCESS: User
 * Send filter options
 * @param GenericRequest
 * @param res
 * @param next
 * @returns void
 */
const getFilterOptions = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productService = new product_services_1.default();
        const query = req.query;
        const brands = await productService.getBrandNames(productRepo, query);
        const updateWithBrandState = brands.map((val, index) => ({
            id: index + 1,
            name: val,
            checked: false,
        }));
        const colors = await productService.getColors(productRepo, query);
        const updateWithColorState = colors.map((val, index) => ({
            id: index + 1,
            name: val,
            checked: false,
        }));
        const optionsKey = [{ title: 'brands', key: 'brand', values: updateWithBrandState }, { title: 'colors', key: 'color', values: updateWithColorState }];
        const responseData = [];
        for (let op of optionsKey) {
            const option = {
                id: (0, lodash_1.uniqueId)('cat'),
                title: op.title,
                values: op.values,
                key: op.key
            };
            responseData.push(option);
        }
        const response = {
            res,
            message: { filters: responseData },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getFilterOptions = getFilterOptions;
/**
 * handles a general search on products
 */
const searchProducts = async (req, res, next) => {
    try {
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        if (!req.query.page) {
            req.query.page = '1';
        }
        const resultPerPage = 20;
        const query = { ...req.query };
        const copyQuery = { ...req.query };
        delete copyQuery.page;
        delete copyQuery.sort;
        delete copyQuery.limit;
        let copyQueryString = JSON.stringify(copyQuery);
        copyQueryString = copyQueryString.replace(/\b(lt|lte|gt|gte)\b/g, ((val) => `$${val}`));
        const queryObject = JSON.parse(copyQueryString);
        const totalAvailableProducts = await productRepo.countTotalProductsByQuery(queryObject);
        const searchEngine = new SearchEngine_1.default(productModel_1.default, query).search().filter().sort().pager(resultPerPage, totalAvailableProducts);
        if (typeof searchEngine === 'number') {
            const response = {
                res,
                message: { products: [] },
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: true
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        //Resolving the mongoose promise
        const productQuery = searchEngine.query;
        const products = await productQuery;
        if ((0, lodash_1.isEmpty)(products)) {
            const response = {
                res,
                message: { products: [], page: req.query.page, totalPages: 0, itemsShowing: products?.length, totalItems: totalAvailableProducts },
                statusCode: http_status_codes_1.StatusCodes.OK,
                success: false
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        const totalPages = Math.ceil(totalAvailableProducts / resultPerPage);
        const response = {
            res,
            message: { products: products, page: req.query.page, totalPages, itemsShowing: products?.length, totalItems: totalAvailableProducts },
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.searchProducts = searchProducts;
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
//# sourceMappingURL=productController.js.map