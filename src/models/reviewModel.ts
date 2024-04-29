import mongoose, { Document, Model } from 'mongoose';

// Define the interface for the review document
export interface ReviewDocument extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId
    title?: string;
    description?: string;
    star: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the mongoose schema for the review document
const ReviewSchema = new mongoose.Schema<ReviewDocument, Model<ReviewDocument>>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String },
    description: { type: String },
    star: { type: Number, min: 0, max: 5, default: 0 },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
}, { timestamps: true });

// Create and export the Mongoose model for the review document
export default mongoose.model<ReviewDocument>('Review', ReviewSchema)
