import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the interface representing the Mongoose document
interface PromoDocument extends Document {
    offername: string;
    banner:string
    type: 'PERCENTAGE' | 'FLAT';
    method: 'COUPON' | 'VOUCHER';
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    code: string;
    discountPercentage: number;
    maxUsage: number;
    usedBy: string[];
    discountAmount: number;
    categories: string[]
    products: string[]
    status:string
}

// Define the Mongoose schema for the Promo document
const PromoSchema: Schema<PromoDocument> = new Schema({
    offername: { type: String, required: true },
    banner : {type: String},
    type: { type: String, enum: ['PERCENTAGE', 'FLAT'], required: true },
    method: { type: String, enum: ['COUPON', 'VOUCHER'], required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    code: { type: String, trim: true, unique: true },
    discountPercentage: { type: Number, required:true },
    maxUsage: { type: Number, required: true },
    usedBy: [{ type: Types.ObjectId, ref:'User' }],
    discountAmount: { type: Number  },
    categories:[
        { type: Types.ObjectId, ref:'Category'}
    ],
    products:[
        {
            type: Types.ObjectId,
            ref: 'product'
        }
    ],
    status: {
        type:String,
        trim: true,
        enum:['Active','Expired', 'Deactivated'],
        default:'Active'
    }
});

// Create and export the Mongoose model
const PromoModel = mongoose.model<PromoDocument>('Promo', PromoSchema);
export default PromoModel;
