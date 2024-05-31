"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the mongoose schema for the review document
const ReviewSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String },
    description: { type: String },
    star: { type: Number, min: 0, max: 5, default: 0 },
}, { timestamps: true });
// Create and export the Mongoose model for the review document
exports.default = mongoose_1.default.model('Review', ReviewSchema);
//# sourceMappingURL=reviewModel.js.map