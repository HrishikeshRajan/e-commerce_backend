"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromoStatus = exports.getAllPromos = exports.get = exports.create = void 0;
const promoModel_1 = __importDefault(require("@models/promoModel"));
const ImageProcessing_repository_1 = __importDefault(require("@repositories/ImageProcessing.repository"));
const image_processing_services_1 = require("@services/image.processing.services");
const response_services_1 = require("@services/response.services");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const image_helper_1 = require("@utils/image.helper");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
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
const create = async (req, res, next) => {
    try {
        const secure_url = await handleImageUpload(req);
        const url = (await secure_url).secure_url;
        req.body.status = String(req.body.status).toUpperCase();
        (0, lodash_1.merge)(req.body, { banner: { secure_url: url } });
        (0, lodash_1.merge)(req.body, { tags: JSON.parse(req.body.tags) });
        (0, lodash_1.merge)(req.body, { startTime: new Date(JSON.parse(req.body.startTime)) });
        (0, lodash_1.merge)(req.body, { endTime: new Date(JSON.parse(req.body.endTime)) });
        const result = await promoModel_1.default.create(req.body);
        const response = {
            message: { tes: result },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return next(new CustomError_1.default('Invalid Promo Cdoe', http_status_codes_1.StatusCodes.CONFLICT, false));
        }
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.create = create;
const get = async (req, res, next) => {
    try {
        const methodMap = {
            'coupon': "COUPON" /* Method.COUPON */,
            'voucher': "VOUCHER" /* Method.VOUCHER */
        };
        const result = await promoModel_1.default.find({
            method: methodMap[req.query.method],
        });
        const response = {
            message: { tes: result },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.get = get;
const getAllPromos = async (req, res, next) => {
    try {
        const result = await promoModel_1.default.find({});
        const response = {
            message: { promos: result, totalPages: result.length },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getAllPromos = getAllPromos;
const updatePromoStatus = async (req, res, next) => {
    try {
        const promo = await promoModel_1.default.findById(req.query.promoId);
        if (!promo)
            throw new Error('No promo found');
        promo.status = String(req.query.status).toUpperCase() ?? "PENDING" /* Status.PENDING */;
        promo?.modifiedPaths();
        const result = (await promo.save()).toObject();
        const response = {
            message: { promo: { status: result.status, promoId: result._id } },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.updatePromoStatus = updatePromoStatus;
//# sourceMappingURL=promoController.js.map