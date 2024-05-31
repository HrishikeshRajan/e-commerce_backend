"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.deleteCategory = exports.update = exports.create = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const ImageProcessing_repository_1 = __importDefault(require("../repository/ImageProcessing.repository"));
const category_repository_1 = require("../repository/category.repository");
const image_processing_services_1 = require("../services/image.processing.services");
const response_services_1 = require("../services/response.services");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const image_helper_1 = require("../utils/image.helper");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const create = async (req, res, next) => {
    try {
        //Handles image upload 
        const options = {
            folder: 'category',
            gravity: 'auto',
            zoom: '0.6',
            crop: 'fill'
        };
        const base64 = (0, image_helper_1.convertToBase64)(req);
        const ImageServiceRepository = new ImageProcessing_repository_1.default();
        const imageServices = new image_processing_services_1.ImageProcessingServices();
        const imageUrls = await imageServices.uploadImage(ImageServiceRepository, base64, options);
        const logoUrls = {
            secure_url: imageUrls.secure_url,
        };
        (0, lodash_1.merge)(req.body, { image: logoUrls });
        const category = new category_repository_1.CategoryRepo(categoryModel_1.default);
        const result = await category.create(req.body);
        const response = { res, message: { category: result }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const categoryRepo = new category_repository_1.CategoryRepo(categoryModel_1.default);
        if (req.files) {
            //Handles image upload 
            const options = {
                folder: 'category',
                gravity: 'auto',
                zoom: '0.6',
                crop: 'fill'
            };
            const base64 = (0, image_helper_1.convertToBase64)(req);
            const ImageServiceRepository = new ImageProcessing_repository_1.default();
            const imageServices = new image_processing_services_1.ImageProcessingServices();
            const imageUrls = await imageServices.uploadImage(ImageServiceRepository, base64, options);
            const imageUrl = {
                secure_url: imageUrls.secure_url,
            };
            (0, lodash_1.merge)(req.body, { image: imageUrl });
        }
        const result = await categoryRepo.edit(req.params.catId, req.body);
        const response = { res, message: { category: result }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.update = update;
const deleteCategory = async (req, res, next) => {
    try {
        const categoryRepo = new category_repository_1.CategoryRepo(categoryModel_1.default);
        const result = await categoryRepo.delete(req.params.catId);
        const response = { res, message: { category: result }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.deleteCategory = deleteCategory;
const getAll = async (req, res, next) => {
    try {
        const categoryRepo = new category_repository_1.CategoryRepo(categoryModel_1.default);
        const result = await categoryRepo.getAll();
        res.setHeader('Cache-Control', 'public, max-age=8600000, must-validate');
        const response = { res, message: { categories: result }, statusCode: http_status_codes_1.StatusCodes.OK, success: true };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        const errorObj = error;
        next(new CustomError_1.default(errorObj.message, errorObj.code, false));
    }
};
exports.getAll = getAll;
//# sourceMappingURL=categoryController.js.map