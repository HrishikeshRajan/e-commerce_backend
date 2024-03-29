import { Document } from "mongoose"


export const enum Status {
    PENDING = 'Pending',
    ACTIVE = 'Active',
    EXPIRED = 'Expired'

}

export const enum Method {
    COUPON = 'COUPON',
    VOUCHER = 'VOUCHER'
    }
    export interface Promo extends Document {
        offername: string
        banner: {
            secure_url: string
        },
        type: 'PERCENTAGE' | 'FLAT' | 'FREE SHIPPING'
        method: 'COUPON' | 'VOUCHER'
        startTime: string
        endTime: string
        code: string
        discountPercentage?: number
        maxUsage: Number
        usedBy: [{ userId: string, count: number }]
        discountAmount?: number
        minAmountInCart: number
        tags: {
            products?: string[]
            categories?: string[]
            users?: string[]
        }
        status: string
        maxUsagePerUser: number
        _id:string
    }


export interface CouponType extends Promo {
    type: 'PERCENTAGE' | 'FLAT'
    method: 'COUPON'
}

export interface Voucher extends Promo {
    method: 'VOUCHER'
}


export type AppliedPromo = {
    type:'FLAT' | 'PERCENTAGE',
    originalAmount:number,
    discountFixedAmount: number,
    discountedPrice:number,
    tax:number
    discountedPriceAftTax:number,
    yourSavings:number
    couponId:string
    productId?:string
    promoCode: string
  };