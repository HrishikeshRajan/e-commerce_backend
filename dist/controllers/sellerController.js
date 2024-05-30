"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countTotals = exports.injectShop = exports.injectUser = exports.editShop = exports.getShopById = exports.listMyShops = exports.deleteShops = exports.deleteShop = exports.createShop = exports.update = void 0;
const user_services_1 = __importDefault(require("@services/user.services"));
const response_services_1 = require("@services/response.services");
const user_repository_1 = __importDefault(require("@repositories/user.repository"));
const seller_repository_1 = __importDefault(require("@repositories/seller.repository"));
const SellerSerivces_1 = __importDefault(require("@services/SellerSerivces"));
const shopModel_1 = __importDefault(require("@models/shopModel"));
const shop_helper_1 = require("@utils/shop.helper");
const user_helper_1 = require("@utils/user.helper");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const lodash_1 = require("lodash");
const http_status_codes_1 = require("http-status-codes");
const ImageProcessing_repository_1 = __importDefault(require("@repositories/ImageProcessing.repository"));
const image_processing_services_1 = require("@services/image.processing.services");
const product_repository_1 = require("@repositories/product.repository");
const productModel_1 = __importDefault(require("@models/productModel"));
const user_services_2 = __importDefault(require("@services/user.services"));
/**
 * Update the user document seller property
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const update = async (req, res, next) => {
    try {
        const userRepo = new user_repository_1.default();
        const userService = new user_services_2.default();
        if (!req.user) {
            return next(new CustomError_1.default('user property not found in req object ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const updatedUser = await userService.setSeller(userRepo, req.user.id);
        if (!updatedUser) {
            return next(new CustomError_1.default('User not found in database', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { message: (0, user_helper_1.userFilter)(updatedUser) }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.update = update;
/**
 * Create new shop document
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const createShop = async (req, res, next) => {
    try {
        //Handles image upload 
        const options = {
            folder: 'shop',
            gravity: 'faces',
            height: 150,
            width: 150,
            zoom: '0.6',
            crop: 'thumb'
        };
        const ImageServiceRepository = new ImageProcessing_repository_1.default();
        const imageServices = new image_processing_services_1.ImageProcessingServices();
        const imageUrls = await imageServices.uploadImage(ImageServiceRepository, req.body.logo, options);
        const logoUrls = {
            id: imageUrls.public_id,
            secure_url: imageUrls.secure_url,
            url: imageUrls.url
        };
        const sellerRepo = new seller_repository_1.default(shopModel_1.default);
        const sellerService = new SellerSerivces_1.default();
        if (!req.user) {
            return next(new CustomError_1.default('user property not found in req object ', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        (0, lodash_1.merge)(req.body, { owner: req.user?.id }, { logo: logoUrls });
        const shop = await sellerService.createShop(sellerRepo, req.body);
        (0, response_services_1.sendHTTPResponse)({ res, message: { message: 'Succesfully Created' }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.createShop = createShop;
/**
 * Delete the shop document by shop id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const deleteShop = async (req, res, next) => {
    try {
        if ((0, lodash_1.isEmpty)(req.shop)) {
            return next(new CustomError_1.default('shop object is not present in req object', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        const sellerRepo = new seller_repository_1.default(shopModel_1.default);
        const sellerService = new SellerSerivces_1.default();
        const isDeleted = await sellerService.delete(sellerRepo, req.shop._id);
        if ((0, lodash_1.isEmpty)(isDeleted) || !isDeleted) {
            return next(new CustomError_1.default('Delete method returns null', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { deleted: isDeleted.toJSON() }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteShop = deleteShop;
/**
 * Delete the shop document by shop id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const deleteShops = async (req, res, next) => {
    try {
        const sellerRepo = new seller_repository_1.default(shopModel_1.default);
        const sellerService = new SellerSerivces_1.default();
        const isShopsDeleted = await sellerService.deleteShopsByIds(sellerRepo, req.body.shopsIds);
        if (!isShopsDeleted.deletedCount) {
            return next(new CustomError_1.default('No product found that owned by your seller id', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { deleted: isShopsDeleted }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteShops = deleteShops;
/**
 * fetchs the shops by owner id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const listMyShops = async (req, res, next) => {
    try {
        const sellerRepo = new seller_repository_1.default(shopModel_1.default);
        const sellerService = new SellerSerivces_1.default();
        const totalAvailableShops = await sellerService.countTotalShopsBySellerId(sellerRepo, req.user?.id);
        const shops = await sellerService.findShopsByOwnerId(sellerRepo, req.user?.id);
        if (!shops) {
            return next(new CustomError_1.default('No Shops found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        (0, response_services_1.sendHTTPResponse)({ res, message: { shops, totalItems: totalAvailableShops }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.listMyShops = listMyShops;
/**
 * fetchs the shop by shop id
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const getShopById = async (req, res, next) => {
    try {
        (0, response_services_1.sendHTTPResponse)({ res, message: { shop: (0, lodash_1.get)(req, 'shop') }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.getShopById = getShopById;
/**
 * Edits shops by shop id
 
 * @param req
 * @param res
 * @param next
 * @returns void
 */
const editShop = async (req, res, next) => {
    try {
        if (typeof req.body.logo === 'string') {
            //Handles image upload 
            const options = {
                folder: 'shop',
                gravity: 'faces',
                height: 150,
                width: 150,
                zoom: '0.6',
                crop: 'thumb'
            };
            const ImageServiceRepository = new ImageProcessing_repository_1.default();
            const imageServices = new image_processing_services_1.ImageProcessingServices();
            const imageUrls = await imageServices.uploadImage(ImageServiceRepository, req.body.logo, options);
            const logoUrls = {
                id: imageUrls.public_id,
                secure_url: imageUrls.secure_url,
                url: imageUrls.url
            };
            (0, lodash_1.merge)(req.body, { logo: logoUrls });
        }
        const sellerRepo = new seller_repository_1.default(shopModel_1.default);
        const sellerService = new SellerSerivces_1.default();
        const shopDocument = await sellerService.editById(sellerRepo, req.shop?._id, req.body);
        if (!shopDocument) {
            return next(new CustomError_1.default('Shop not found by give shopId', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        /**
         * This function returns a modified shop object
         */
        const result = shop_helper_1.shopFilter.sanitize(shopDocument);
        (0, response_services_1.sendHTTPResponse)({ res, message: { message: result }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.editShop = editShop;
/**
 * Middleware that injects a user object into the req object.
 * @param {GenericRequest} req
 * @param res
 * @param next
 * @param {string} id
 * @returns void
 */
const injectUser = async (req, res, next, id) => {
    const userRepo = new user_repository_1.default();
    const service = new user_services_1.default();
    const userObject = await service.getUser(userRepo, id);
    if (!userObject) {
        return next(new CustomError_1.default('User not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
    }
    const user = { user: (0, user_helper_1.userFilter)(userObject) };
    (0, lodash_1.merge)(req, user);
    next();
};
exports.injectUser = injectUser;
/**
 * Middleware that injects a shop object into the req object.
 * @param {GenericRequest} req
 * @param res
 * @param next
 * @param {string} id
 * @returns void
 */
const injectShop = async (req, res, next, id) => {
    const sellerRepo = new seller_repository_1.default(shopModel_1.default);
    const sellerService = new SellerSerivces_1.default();
    //mongoose shop document
    const shopDocument = await sellerService.findById(sellerRepo, id);
    if (!shopDocument) {
        return next(new CustomError_1.default('Shop not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
    }
    //Here we convert it in to plain javascript object
    const shopObj = shopDocument.toObject();
    const shop = { shop: shopObj };
    //Merge it with request object
    (0, lodash_1.merge)(req, shop);
    next();
};
exports.injectShop = injectShop;
const countTotals = async (req, res, next) => {
    try {
        const sellerRepo = new seller_repository_1.default(shopModel_1.default);
        const sellerService = new SellerSerivces_1.default();
        const totalAvailableShops = await sellerService.countTotalShopsBySellerId(sellerRepo, req.user?.id);
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const totalAvailableProducts = await productRepo.countTotalProductsBySellerId(req.user.id);
        (0, response_services_1.sendHTTPResponse)({ res, message: { shopsCount: totalAvailableShops, totalProducts: totalAvailableProducts }, statusCode: http_status_codes_1.StatusCodes.OK, success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.countTotals = countTotals;
//Add Shops
//Edit Shops
//Delete Shops
//list Shops
//list specific shop
//list owner shops
//# sourceMappingURL=sellerController.js.map