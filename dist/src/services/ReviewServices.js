"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
/**
 * Higher Level Class
 */
class ReviewServices {
    create(repo, review) {
        return repo.create(review);
    }
    findReviewByUserIdAndProductId(repo, userId, productId) {
        return repo.findReviewByUserIdAndProductId(userId, productId);
    }
    findReviewByIdAndUpdate(repo, reviewId, review) {
        return repo.findReviewByIdAndUpdate(reviewId, review);
    }
    findReviewByIdAndDelete(repo, reviewId) {
        return repo.findReviewByIdAndDelete(reviewId);
    }
    queryReviewsByProductId(repo, productId) {
        return repo.queryReviewsByProductId(productId);
    }
    countReviewsByProductId(repo, productId) {
        return repo.countReviewsByProductId(productId);
    }
}
exports.ReviewServices = ReviewServices;
//# sourceMappingURL=ReviewServices.js.map