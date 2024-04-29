import productModel from "@models/productModel"
import reviewModel, { ReviewDocument } from "@models/reviewModel"
import { ProductRepo } from "@repositories/product.repository"
import { ReviewRepository } from "@repositories/review.repository"
import ProductServices from "@services/product.services"
import { sendHTTPResponse } from "@services/response.services"
import { ReviewServices } from "@services/ReviewServices"
import CustomError from "@utils/CustomError"
import { getUserId } from "@utils/user.helper"
import { type Request, type Response, type NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { merge } from "lodash"
import { Types } from "mongoose"
import { IResponse } from "types/IResponse.interfaces"
import { ProductDocument } from "types/product.interface"
import { ReviewDeleteParams, ReviewListByQuery, type Review, type ReviewId } from "types/zod/review.schema.zod"


const calculateRating = async (productId: string) => {
    const reviews = await reviewModel.aggregate([
        { $match: { productId: new Types.ObjectId(productId) } },

        {
            $group: {
                _id: null,
                avgRating: { $avg: '$star' },
                totalCount: { $sum: 1 }
            }
        }
    ])

    if (reviews.length < 1) {
        return null
    }

    return {
        avgRating: parseInt(reviews[0].avgRating),
        totalReviews: parseInt(reviews[0].totalCount)
    }

}

/**
 * util functions
 */
const getReviewId = (req: Request) => req.params.reviewId

export const create = async (
    req: Request,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const ReviewRepo = new ReviewRepository(reviewModel)
        const ReviewService = new ReviewServices()

        const productRepo = new ProductRepo<ProductDocument>(productModel)
        const productService = new ProductServices()

        const product = await productService.findProductById(productRepo, req.body.productId)
        if (!product) {
            return next(new CustomError('No product found', StatusCodes.NOT_FOUND, false))
        }

        const hasAlreadyReviewed = await ReviewService.findReviewByUserIdAndProductId(ReviewRepo, getUserId(req), req.body.productId)
        if (hasAlreadyReviewed) {
            merge(hasAlreadyReviewed, req.body)
            hasAlreadyReviewed.modifiedPaths()
            const result = await hasAlreadyReviewed.save({ validateBeforeSave: true })

            const data = await calculateRating(req.body.productId)
            if (data === null) {
                product.numberOfReviews = 0
                product.ratings = 0
            } else {
                product.numberOfReviews = data.totalReviews
                product.ratings = data.avgRating
            }

            product.modifiedPaths()
            product.save()

            const response: IResponse = {
                message: { comment: result },
                success: true,
                statusCode: StatusCodes.CREATED,
                res
            }
            return sendHTTPResponse(response)
        }
        const result = await ReviewService.create(ReviewRepo, req.body)


        const data = await calculateRating(req.body.productId)
        if (data === null) {
            product.numberOfReviews = 0
            product.ratings = 0
        } else {
            product.numberOfReviews = data.totalReviews
            product.ratings = data.avgRating
        }


        product.modifiedPaths()
        product.save()


        const response: IResponse = {
            message: { comment: result },
            success: true,
            statusCode: StatusCodes.CREATED,
            res
        }
        sendHTTPResponse(response)
    } catch (error) {
        if (error instanceof Error) {
            return next(new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, false))
        }
    }
}


export const edit = async (
    req: Request<ReviewId, ReviewDocument, Review, {}>,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const ReviewRepo = new ReviewRepository(reviewModel)
        const ReviewService = new ReviewServices()

        const productRepo = new ProductRepo<ProductDocument>(productModel)
        const productService = new ProductServices()

        const product = await productService.findProductById(productRepo, req.body.productId)
        if (!product) {
            return next(new CustomError('No product found', StatusCodes.NOT_FOUND, false))
        }

        const hasAlreadyReviewed = await ReviewService.findReviewByIdAndUpdate(ReviewRepo, getReviewId(req), req.body)
        if (!hasAlreadyReviewed) {
            return next(new CustomError('You have not submitted a review yet.', StatusCodes.NOT_FOUND, false))
        }


        const data = await calculateRating(req.body.productId)
        if (data === null) {
            product.numberOfReviews = 0
            product.ratings = 0
        } else {
            product.numberOfReviews = data.totalReviews
            product.ratings = data.avgRating
        }


        product.modifiedPaths()
        product.save()

        const response: IResponse = {
            message: { comment: hasAlreadyReviewed },
            success: true,
            statusCode: StatusCodes.CREATED,
            res
        }
        sendHTTPResponse(response)
    } catch (error) {
        if (error instanceof Error) {
            return next(new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, false))
        }
    }
}
export const deleteReview = async (
    req: Request<ReviewDeleteParams>,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const ReviewRepo = new ReviewRepository(reviewModel)
        const ReviewService = new ReviewServices()

        const productRepo = new ProductRepo<ProductDocument>(productModel)
        const productService = new ProductServices()

        const product = await productService.findProductById(productRepo, req.params.productId)
        if (!product) {
            return next(new CustomError('No product found', StatusCodes.NOT_FOUND, false))
        }

        const isReviewDeleted = await ReviewService.findReviewByIdAndDelete(ReviewRepo, getReviewId(req))

        if (!isReviewDeleted) {
            return next(new CustomError('Your review not found', StatusCodes.NOT_FOUND, false))
        }
        const data = await calculateRating(req.body.productId)
        if (data === null) {
            product.numberOfReviews = 0
            product.ratings = 0
        } else {
            product.numberOfReviews = data.totalReviews
            product.ratings = data.avgRating
        }

        product.modifiedPaths()
        product.save()

        const response: IResponse = {
            message: { comment: 'Successfully deleted' },
            success: true,
            statusCode: StatusCodes.OK,
            res
        }
        sendHTTPResponse(response)
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            return next(new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, false))
        }
    }
}
export const getReviewsByProductId = async (
    req: Request<{}, ReviewDocument[], {}, ReviewListByQuery>,
    res: Response<IResponse>,
    next: NextFunction):
    Promise<void> => {
    try {

        const ReviewRepo = new ReviewRepository(reviewModel)
        const ReviewService = new ReviewServices()

        const resultPerPage = 5
        const page = parseInt((req.query.page as string) ?? '1')

        const reviews = await ReviewService.queryReviewsByProductId(ReviewRepo, req.query.pId).populate('userId', 'fullname photo _id').limit(10).skip(resultPerPage * (page - 1))
        if (reviews.length < 1) {
            const response: IResponse = {
                message: { comments: [], totalReviewsCount: 0, totalPages: 0 },
                success: true,
                statusCode: StatusCodes.OK,
                res
            }
            return sendHTTPResponse(response)
        }

        const totalReviews = await ReviewService.countReviewsByProductId(ReviewRepo, req.query.pId)
        const totalPages = Math.ceil(totalReviews / resultPerPage);
        const response: IResponse = {
            message: { comments: reviews, totalReviewsCount: totalReviews, totalPages },
            success: true,
            statusCode: StatusCodes.OK,
            res
        }
        sendHTTPResponse(response)
    } catch (error) {
        if (error instanceof Error) {
            return next(new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, false))
        }
    }
}