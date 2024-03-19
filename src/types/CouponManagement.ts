export interface Promo {
    offername: string
    type: 'PERCENTAGE' | 'FLAT'
    method: 'COUPON' | 'VOUCHER' | 'FLASHSALE'
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    code: string
    discountPercentage: number
    maxUsage:Number
    usedBy:string[]
    discountAmount:number
}


export interface Coupon extends Promo {
    method: 'COUPON'
}

export interface Voucher extends Promo {
    method: 'VOUCHER'
}

export interface FlashSale extends Promo {
    method: 'FLASHSALE'
}


