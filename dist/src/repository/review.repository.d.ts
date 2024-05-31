import { ReviewDocument } from "@models/reviewModel";
import { Model, Query } from "mongoose";
import { IReview } from "types/IReview";
import { Review } from "types/zod/review.schema.zod";
export declare class ReviewRepository implements IReview {
    reviewSchema: Model<ReviewDocument>;
    constructor(reviewSchema: Model<ReviewDocument>);
    findReviewByUserIdAndProductId(userId: string, productId: string): Promise<ReviewDocument | null>;
    findReviewByIdAndUpdate(reviewId: string, review: Review): Promise<ReviewDocument | null>;
    findReviewByIdAndDelete(reviewId: string): Promise<ReviewDocument | null>;
    queryReviewsByProductId(productId: string): Query<ReviewDocument[], ReviewDocument, {}, ReviewDocument>;
    countReviewsByProductId(productId: string): Promise<number>;
    create(review: Review): Promise<ReviewDocument>;
}
//# sourceMappingURL=review.repository.d.ts.map