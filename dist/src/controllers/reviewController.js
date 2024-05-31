"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByProductId = exports.deleteReview = exports.edit = exports.create = void 0;
const productModel_1 = __importDefault(require("@models/productModel"));
const reviewModel_1 = __importDefault(require("@models/reviewModel"));
const product_repository_1 = require("@repositories/product.repository");
const review_repository_1 = require("@repositories/review.repository");
const product_services_1 = __importDefault(require("@services/product.services"));
const response_services_1 = require("@services/response.services");
const ReviewServices_1 = require("@services/ReviewServices");
const CustomError_1 = __importDefault(require("@utils/CustomError"));
const user_helper_1 = require("@utils/user.helper");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const calculateRating = async (productId) => {
    const reviews = await reviewModel_1.default.aggregate([
        { $match: { productId: new mongoose_1.Types.ObjectId(productId) } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$star' },
                totalCount: { $sum: 1 }
            }
        }
    ]);
    if (reviews.length < 1) {
        return null;
    }
    return {
        avgRating: parseInt(reviews[0].avgRating),
        totalReviews: parseInt(reviews[0].totalCount)
    };
};
/**
 * util functions
 */
const getReviewId = (req) => req.params.reviewId;
const create = async (req, res, next) => {
    try {
        const ReviewRepo = new review_repository_1.ReviewRepository(reviewModel_1.default);
        const ReviewService = new ReviewServices_1.ReviewServices();
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productService = new product_services_1.default();
        const product = await productService.findProductById(productRepo, req.body.productId);
        if (!product) {
            return next(new CustomError_1.default('No product found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const hasAlreadyReviewed = await ReviewService.findReviewByUserIdAndProductId(ReviewRepo, (0, user_helper_1.getUserId)(req), req.body.productId);
        if (hasAlreadyReviewed) {
            (0, lodash_1.merge)(hasAlreadyReviewed, req.body);
            hasAlreadyReviewed.modifiedPaths();
            const result = await hasAlreadyReviewed.save({ validateBeforeSave: true });
            const data = await calculateRating(req.body.productId);
            if (data === null) {
                product.numberOfReviews = 0;
                product.ratings = 0;
            }
            else {
                product.numberOfReviews = data.totalReviews;
                product.ratings = data.avgRating;
            }
            product.modifiedPaths();
            product.save();
            const response = {
                message: { comment: result },
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                res
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        const result = await ReviewService.create(ReviewRepo, req.body);
        const data = await calculateRating(req.body.productId);
        if (data === null) {
            product.numberOfReviews = 0;
            product.ratings = 0;
        }
        else {
            product.numberOfReviews = data.totalReviews;
            product.ratings = data.avgRating;
        }
        product.modifiedPaths();
        product.save();
        const response = {
            message: { comment: result },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return next(new CustomError_1.default('Something went wrong', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
    }
};
exports.create = create;
const edit = async (req, res, next) => {
    try {
        const ReviewRepo = new review_repository_1.ReviewRepository(reviewModel_1.default);
        const ReviewService = new ReviewServices_1.ReviewServices();
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productService = new product_services_1.default();
        const product = await productService.findProductById(productRepo, req.body.productId);
        if (!product) {
            return next(new CustomError_1.default('No product found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const hasAlreadyReviewed = await ReviewService.findReviewByIdAndUpdate(ReviewRepo, getReviewId(req), req.body);
        if (!hasAlreadyReviewed) {
            return next(new CustomError_1.default('You have not submitted a review yet.', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const data = await calculateRating(req.body.productId);
        if (data === null) {
            product.numberOfReviews = 0;
            product.ratings = 0;
        }
        else {
            product.numberOfReviews = data.totalReviews;
            product.ratings = data.avgRating;
        }
        product.modifiedPaths();
        product.save();
        const response = {
            message: { comment: hasAlreadyReviewed },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new CustomError_1.default('Something went wrong', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
    }
};
exports.edit = edit;
const deleteReview = async (req, res, next) => {
    try {
        const ReviewRepo = new review_repository_1.ReviewRepository(reviewModel_1.default);
        const ReviewService = new ReviewServices_1.ReviewServices();
        const productRepo = new product_repository_1.ProductRepo(productModel_1.default);
        const productService = new product_services_1.default();
        const product = await productService.findProductById(productRepo, req.params.productId);
        if (!product) {
            return next(new CustomError_1.default('No product found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const isReviewDeleted = await ReviewService.findReviewByIdAndDelete(ReviewRepo, getReviewId(req));
        if (!isReviewDeleted) {
            return next(new CustomError_1.default('Your review not found', http_status_codes_1.StatusCodes.NOT_FOUND, false));
        }
        const data = await calculateRating(req.body.productId);
        if (data === null) {
            product.numberOfReviews = 0;
            product.ratings = 0;
        }
        else {
            product.numberOfReviews = data.totalReviews;
            product.ratings = data.avgRating;
        }
        product.modifiedPaths();
        product.save();
        const response = {
            message: { comment: 'Successfully deleted' },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return next(new CustomError_1.default('Something went wrong', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
    }
};
exports.deleteReview = deleteReview;
const getReviewsByProductId = async (req, res, next) => {
    try {
        const ReviewRepo = new review_repository_1.ReviewRepository(reviewModel_1.default);
        const ReviewService = new ReviewServices_1.ReviewServices();
        const resultPerPage = 5;
        const page = parseInt(req.query.page ?? '1');
        const reviews = await ReviewService.queryReviewsByProductId(ReviewRepo, req.query.pId).populate('userId', 'fullname photo _id').limit(10).skip(resultPerPage * (page - 1));
        if (reviews.length < 1) {
            const response = {
                message: { comments: [], totalReviewsCount: 0, totalPages: 0 },
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                res
            };
            return (0, response_services_1.sendHTTPResponse)(response);
        }
        const totalReviews = await ReviewService.countReviewsByProductId(ReviewRepo, req.query.pId);
        const totalPages = Math.ceil(totalReviews / resultPerPage);
        const response = {
            message: { comments: reviews, totalReviewsCount: totalReviews, totalPages },
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            res
        };
        (0, response_services_1.sendHTTPResponse)(response);
    }
    catch (error) {
        if (error instanceof Error) {
            return next(new CustomError_1.default('Something went wrong', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, false));
        }
    }
};
exports.getReviewsByProductId = getReviewsByProductId;
//# sourceMappingURL=reviewController.js.map