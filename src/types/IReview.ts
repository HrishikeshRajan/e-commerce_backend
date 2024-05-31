import { ReviewDocument } from "../models/reviewModel"
import { Review } from "./zod/review.schema.zod"
import { Query } from "mongoose";

/**
 * Abstraction
 */
export interface IReview {
    create(review: Review): Promise<ReviewDocument>;
    findReviewByUserIdAndProductId(userId: string, productId: string): Promise<ReviewDocument | null>;
    findReviewByIdAndUpdate(reviewId: string,review:Review): Promise<ReviewDocument | null>;
    findReviewByIdAndDelete(reviewId: string): Promise<ReviewDocument | null>;
    queryReviewsByProductId(productId: string): Query<ReviewDocument[], ReviewDocument>;
    countReviewsByProductId(productId: string): Promise<number>;
}
