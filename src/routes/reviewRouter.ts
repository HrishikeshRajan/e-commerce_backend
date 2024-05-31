import express from 'express'
import * as reviewController from '../controllers/reviewController'
import { isLoggedIn } from '../middlewares/auth'
import { validateRequest } from '../middlewares/userInputValidator'
import { ReviewDeleteZodSchema, ReviewIdZodSchema, ReviewListByQueryZodSchema, ReviewUpdateZodSchema, ReviewZodSchema, } from '../types/zod/review.schema.zod'
const router = express.Router()

router.route('/')
    .post(isLoggedIn, validateRequest({ body: ReviewZodSchema }), reviewController.create)
router.route('/')
    .get(validateRequest({ query: ReviewListByQueryZodSchema }), reviewController.getReviewsByProductId)

router.route('/:reviewId')
    .put(isLoggedIn, validateRequest({ params: ReviewIdZodSchema }), validateRequest({ body: ReviewUpdateZodSchema }), reviewController.edit)
router.route('/:reviewId/:productId')
    .delete(isLoggedIn, validateRequest({ params: ReviewDeleteZodSchema }), reviewController.deleteReview)


export default router