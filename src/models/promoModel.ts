import mongoose, { Schema, Document, Types } from 'mongoose';
import { Promo, Status } from 'types/CouponManagement';

// Define the interface representing the Mongoose document
// Define the Mongoose schema for the Promo document

export interface PromoDocument extends Promo { }
const PromoSchema: Schema<PromoDocument> = new Schema({
    offername: { type: String, required: true },
    banner: { secure_url: { type: String } },
    type: { type: String, enum: ['PERCENTAGE', 'FLAT'], required: true },
    method: { type: String, enum: ['COUPON', 'VOUCHER'], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    code: { type: String, trim: true, unique: true },
    discountPercentage: { type: Number },
    maxUsage: { type: Number, required: true },
    usedBy: [{
        userId:{type: Types.ObjectId, ref: 'User'},
        products:Array<string>,
        count: { type: Number }
    }],
    discountAmount: { type: Number },
    minAmountInCart: { type: Number },
    maxUsagePerUser: {type: Number},
    tags: {
        categories: [
            { type: Types.ObjectId, ref: 'Category' }
        ],
        products: [String],
        users: [
            {
                type: Types.ObjectId,
                ref: 'User'
            }
        ],
    },

    status: {
        type: String,
        trim: true,
        enum: [Status.PENDING, Status.ACTIVE, Status.EXPIRED],
        default: Status.PENDING
    }
});

// Create and export the Mongoose model
const PromoModel = mongoose.model<PromoDocument>('Promo', PromoSchema);
export default PromoModel;
