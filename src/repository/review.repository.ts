import { ReviewDocument } from "@models/reviewModel";
import { Model, Query } from "mongoose";
import { IReview } from "types/IReview";
import { Review } from "types/zod/review.schema.zod";


export class ReviewRepository implements IReview {

    reviewSchema: Model<ReviewDocument>;
    constructor(reviewSchema: Model<ReviewDocument>) {
        this.reviewSchema = reviewSchema;
    }
    async findReviewByUserIdAndProductId(userId: string, productId: string): Promise<ReviewDocument | null> {
        const result = await this.reviewSchema.findOne({ userId, productId })
        return result
    }
    async findReviewByIdAndUpdate(reviewId: string, review: Review): Promise<ReviewDocument | null> {
        const result = await this.reviewSchema.findByIdAndUpdate(reviewId, review, { new: true }).populate('userId', 'fullname photo _id')
        return result
    }
    async findReviewByIdAndDelete(reviewId: string): Promise<ReviewDocument | null> {
        const result = await this.reviewSchema.findByIdAndDelete(reviewId)
        return result
    }
    queryReviewsByProductId(productId: string): Query<ReviewDocument[], ReviewDocument, {}, ReviewDocument> {
        const result = this.reviewSchema.find({ productId })
        return result
    }
    async countReviewsByProductId(productId: string): Promise<number> {
        const counts = await this.reviewSchema.countDocuments({ productId })
        return counts
    }
    async create(review: Review): Promise<ReviewDocument> {
        const result = await this.reviewSchema.create(review)
        return result;
    }

}
