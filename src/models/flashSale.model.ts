import { NextFunction } from "express";
import mongoose, { Types } from "mongoose";


interface FlashSaleDocument extends Document {
    name: string;
    category: 'flash_sale';
    banner: {
        secure_url: string;
    };
    startTime: Date;
    endTime: Date;
    discountPercentage?: number;
    priceAfterDiscount?: number;
    product: Types.ObjectId;
    totalQuantityToSell: number;
    currentStock: number;
    users: {
        maxUsersCount: number;
        usedBy: Types.ObjectId[];
    };
    status: string;
    createdAt: Date;
    shop?: Types.ObjectId;
}


export const enum SalesStatus  {
 PENDING ='Pending',
 ACTIVE = 'Active',
 EXPIRED = 'Expired'

}
const flashSaleSchema = new mongoose.Schema<FlashSaleDocument>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type:String,
        enum:['flash_sale']
    },
    banner: {
        secure_url: String
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    discountPercentage: {
        type: Number,
    },
    priceAfterDiscount: {
         type: Number,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    totalQuantityToSell: {
        type: Number,
        default: 1
    },
    currentStock:{
        type: Number,
        default: 0 
    },
    users: {
        maxUsersCount: {

            type: Number,
            default: 0
        },
        usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    status:{
        type:String,
        enum:[SalesStatus.PENDING, SalesStatus.ACTIVE, SalesStatus.EXPIRED],
        default:SalesStatus.PENDING
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shop:{
        type: Types.ObjectId,
        ref:'shop'
    }
});
flashSaleSchema.pre(/^save$/, async function(next) {
    const flash = this as unknown as FlashSaleDocument
    let current =  new Date()
    if (current > flash.startTime && current < flash.endTime ) {
        flash.status = SalesStatus.ACTIVE;
    }
    next();
});

flashSaleSchema.pre(/^save$/, async function(next) {
    const flash = this as unknown as FlashSaleDocument
    if (flash.currentStock <= 0) {
        flash.status = SalesStatus.EXPIRED;
    }
    next();
});

const FlashSale = mongoose.model('FlashSale', flashSaleSchema);

export default FlashSale;
