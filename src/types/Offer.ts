export type TypeOfDiscount = 'PERCENTAGE' | 'FLAT'
export type Method = 'COUPON' | 'VOUCHER' | 'FLASHSALE' | 'CLEARENCE'
export interface IOffer {
    name: string
    typeOfDiscount: TypeOfDiscount
    method: Method
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    discountPercentage: number
    totalUsage: number
    usedBy: string[]
}


export class FlashSale implements IOffer {
    public name: string
    public typeOfDiscount: TypeOfDiscount
    public method: Method
    public startDate: string
    public startTime: string
    public endDate: string
    public endTime: string
    public discountPercentage: number
    public totalUsage: number
    public usedBy: string[]

    constructor(typeOfDiscount: TypeOfDiscount) {
        this.name = ''
        this.typeOfDiscount = typeOfDiscount
        this.method = 'FLASHSALE'
        this.startDate = ''
        this.startTime = ''
        this.endDate = ''
        this.endTime = ''
        this.discountPercentage = 0
        this.totalUsage = 0
        this.usedBy = []
    }


    // Getters
    getName(): string {
        return this.name;
    }

    getTypeOfDiscount(): TypeOfDiscount {
        return this.typeOfDiscount;
    }

    getMethod(): Method {
        return this.method;
    }

    getStartDate(): string {
        return this.startDate;
    }

    getStartTime(): string {
        return this.startTime;
    }

    getEndDate(): string {
        return this.endDate;
    }

    getEndTime(): string {
        return this.endTime;
    }

    getDiscountPercentage(): number {
        return this.discountPercentage;
    }

    getTotalUsage(): number {
        return this.totalUsage;
    }

    getUsedBy(): string[] {
        return this.usedBy;
    }

    // Setters
    setName(name: string): void {
        this.name = name;
    }

    setTypeOfDiscount(typeOfDiscount: TypeOfDiscount): void {
        this.typeOfDiscount = typeOfDiscount;
    }


    setStartDate(startDate: string): void {
        this.startDate = startDate;
    }

    setStartTime(startTime: string): void {
        this.startTime = startTime;
    }

    setEndDate(endDate: string): void {
        this.endDate = endDate;
    }

    setEndTime(endTime: string): void {
        this.endTime = endTime;
    }

    setDiscountPercentage(discountPercentage: number): void {
        this.discountPercentage = discountPercentage;
    }

    setTotalUsage(totalUsage: number): void {
        this.totalUsage = totalUsage;
    }

    setUsedBy(userId: string):void{
      this.usedBy.push(userId)
    }


}




