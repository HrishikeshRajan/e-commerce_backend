import { IReview } from "types/IReview";
import { Review } from "types/zod/review.schema.zod";
import { Query } from 'mongoose';
/**
 * Higher Level Class
 */
export declare class ReviewServices {
    create(repo: IReview, review: Review): Promise<import("../models/reviewModel").ReviewDocument>;
    findReviewByUserIdAndProductId(repo: IReview, userId: string, productId: string): Promise<import("../models/reviewModel").ReviewDocument | null>;
    findReviewByIdAndUpdate(repo: IReview, reviewId: string, review: Review): Promise<import("../models/reviewModel").ReviewDocument | null>;
    findReviewByIdAndDelete(repo: IReview, reviewId: string): Promise<import("../models/reviewModel").ReviewDocument | null>;
    queryReviewsByProductId(repo: IReview, productId: string): Query<import("../models/reviewModel").ReviewDocument[], import("../models/reviewModel").ReviewDocument, {}, import("../models/reviewModel").ReviewDocument>;
    countReviewsByProductId(repo: IReview, productId: string): Promise<number>;
}
//# sourceMappingURL=ReviewServices.d.ts.map