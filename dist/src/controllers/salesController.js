"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToCart = exports.get = exports.create = void 0;
const LoggerFactory_1 = __importDefault(require("../utils/LoggerFactory/LoggerFactory"));
const response_services_1 = require("../services/response.services");
const http_status_codes_1 = require("http-status-codes");
const flashSale_model_1 = __importDefault(require("../models/flashSale.model"));
const image_helper_1 = require("../utils/image.helper");
const ImageProcessing_repository_1 = __importDefault(require("../repository/ImageProcessing.repository"));
const image_processing_services_1 = require("../services/image.processing.services");
const lodash_1 = require("lodash");
const cartModel_1 = __importStar(require("../models/cartModel"));
const mongoose_1 = require("mongoose");
const currency_js_1 = __importDefault(require("currency.js"));
const productModel_1 = __importDefault(require("../models/productModel"));
const logger = LoggerFactory_1.default.getLogger('development')();
const mongoose_2 = __importDefault(require("mongoose"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const handleImageUpload = async (req) => {
    const options = {
        folder: 'offers',
        gravity: 'auto',
    };
    const base64 = (0, image_helper_1.convertToBase64)(req);
    const ImageServiceRepository = new ImageProcessing_repository_1.default();
    const imageServices = new image_processing_services_1.ImageProcessingServices();
    const imageUrls = await imageServices.uploadImage(ImageServiceRepository, base64, options);
    return imageUrls;
};
// put cookie and jwt have same expiry date
const create = async (req, res, next) => {
    try {
        // const secure_url = await handleImageUpload(req)
        // const url = (await secure_url).secure_url
        logger.info(`Flash sale create controller initiated. user: ${req.user.id}`);
        req.body.startTime = new Date(JSON.parse(req.body.startTime));
        req.body.endTime = new Date(JSON.parse(req.body.endTime));
        // merge(req.body, { banner: { secure_url: url } })
        (0, lodash_1.merge)(req.body, { users: { maxUsersCount: 10 } });
        const product = await productModel_1.default.findById(req.body.product, '_id price stock');
        if (!product) {
            return next(new CustomError_1.default('No product found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        if (product.stock < req.body.totalQuantityToSell) {
            return next(new CustomError_1.default('Not enough stock', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        req.body.currentStock = req.body.totalQuantityToSell;
        const flashsale = await flashSale_model_1.default.create(req.body);
        product.stock -= req.body.totalQuantityToSell;
        product.modifiedPaths();
        await product.save();
        const response = {
            res,
            message: {
                message: flashsale
            },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.CREATED
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        logger.error('An error occurred', { error });
        next(error);
    }
};
exports.create = create;
//Flash sale type issue, not showing in client side
const get = async (req, res, next) => {
    try {
        logger.info(`Flash sale create controller initiated`);
        const sale = await flashSale_model_1.default.find({}).sort({ _id: -1 });
        const response = {
            res,
            message: {
                sale: sale[0]
            },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        logger.error('An error occurred', { error });
        next(error);
    }
};
exports.get = get;
const moveToCart = async (req, res, next) => {
    try {
        logger.info(`moveToCart controller initiated. user: ${req.user.id}`);
        const sale = await flashSale_model_1.default.findById(req.params.saleId).populate('product', 'price stock _id');
        if (!sale)
            throw new Error('No flash sale found');
        if (sale.users?.usedBy.includes(req.user.id)) {
            throw new Error('Not Applicable');
        }
        const productPrice = sale?.product?.price;
        const gstInPercentage = 12;
        const tax = (0, currency_js_1.default)(sale.product.price).multiply(gstInPercentage).divide(100);
        let cartObject = {
            userId: new mongoose_2.default.Types.ObjectId(req.user.id),
            grandTotalPrice: sale.priceAfterDiscount + tax.value,
            grandTotalQty: 1,
            grandTotalPriceString: '1000',
            products: {}
        };
        const orderItem = {
            product: new mongoose_1.Types.ObjectId(sale?.product._id),
            qty: 1,
            options: req.body.options,
            orderStatus: cartModel_1.ORDER_STATUS.NOT_PROCESSED,
            totalPrice: productPrice,
            gstInPercentage,
            taxAmount: tax.value,
            totalPriceBeforeTax: productPrice,
            totalPriceAfterTax: Math.round(productPrice + tax.value),
            discount: {
                discountSourceId: sale._id,
                source: 'FlashSale'
            }
        };
        //@ts-ignore
        cartObject.products[sale.product._id.toString()] = orderItem;
        console.log(req.body);
        const cart = await cartModel_1.default.create(cartObject);
        sale.users?.usedBy.push(req.user.id);
        sale.modifiedPaths();
        await sale.save();
        const response = {
            res,
            message: {
                cart: cart
            },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.CREATED
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        logger.error('An error occurred', { error });
        next(error);
    }
};
exports.moveToCart = moveToCart;
//# sourceMappingURL=salesController.js.map