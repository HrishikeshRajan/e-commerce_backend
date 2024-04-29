import { IReview } from "types/IReview";
import { Review } from "types/zod/review.schema.zod";


import { Query } from 'mongoose';

/**
 * Higher Level Class 
 */

export class ReviewServices {
    create(repo: IReview, review: Review) {
        return repo.create(review);
    }

    findReviewByUserIdAndProductId(repo: IReview, userId: string, productId: string) {
        return repo.findReviewByUserIdAndProductId(userId, productId);
    }

    findReviewByIdAndUpdate(repo: IReview, reviewId: string, review: Review) {
        return repo.findReviewByIdAndUpdate(reviewId, review);
    }

    findReviewByIdAndDelete(repo: IReview, reviewId: string) {
        return repo.findReviewByIdAndDelete(reviewId);
    }

    queryReviewsByProductId(repo: IReview, productId: string) {
        return repo.queryReviewsByProductId(productId);
    }

    countReviewsByProductId(repo: IReview, productId: string) {
        return repo.countReviewsByProductId(productId);
    }
}

