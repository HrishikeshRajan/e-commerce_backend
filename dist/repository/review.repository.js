"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
class ReviewRepository {
    reviewSchema;
    constructor(reviewSchema) {
        this.reviewSchema = reviewSchema;
    }
    async findReviewByUserIdAndProductId(userId, productId) {
        const result = await this.reviewSchema.findOne({ userId, productId });
        return result;
    }
    async findReviewByIdAndUpdate(reviewId, review) {
        const result = await this.reviewSchema.findByIdAndUpdate(reviewId, review, { new: true }).populate('userId', 'fullname photo _id');
        return result;
    }
    async findReviewByIdAndDelete(reviewId) {
        const result = await this.reviewSchema.findByIdAndDelete(reviewId);
        return result;
    }
    queryReviewsByProductId(productId) {
        const result = this.reviewSchema.find({ productId });
        return result;
    }
    async countReviewsByProductId(productId) {
        const counts = await this.reviewSchema.countDocuments({ productId });
        return counts;
    }
    async create(review) {
        const result = await this.reviewSchema.create(review);
        return result;
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=review.repository.js.map