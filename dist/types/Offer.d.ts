export type TypeOfDiscount = 'PERCENTAGE' | 'FLAT';
export type Method = 'COUPON' | 'VOUCHER' | 'FLASHSALE' | 'CLEARENCE';
export interface IOffer {
    name: string;
    typeOfDiscount: TypeOfDiscount;
    method: Method;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    discountPercentage: number;
    totalUsage: number;
    usedBy: string[];
}
export declare class FlashSale implements IOffer {
    name: string;
    typeOfDiscount: TypeOfDiscount;
    method: Method;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    discountPercentage: number;
    totalUsage: number;
    usedBy: string[];
    constructor(typeOfDiscount: TypeOfDiscount);
    getName(): string;
    getTypeOfDiscount(): TypeOfDiscount;
    getMethod(): Method;
    getStartDate(): string;
    getStartTime(): string;
    getEndDate(): string;
    getEndTime(): string;
    getDiscountPercentage(): number;
    getTotalUsage(): number;
    getUsedBy(): string[];
    setName(name: string): void;
    setTypeOfDiscount(typeOfDiscount: TypeOfDiscount): void;
    setStartDate(startDate: string): void;
    setStartTime(startTime: string): void;
    setEndDate(endDate: string): void;
    setEndTime(endTime: string): void;
    setDiscountPercentage(discountPercentage: number): void;
    setTotalUsage(totalUsage: number): void;
    setUsedBy(userId: string): void;
}
//# sourceMappingURL=Offer.d.ts.map