"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSale = void 0;
class FlashSale {
    name;
    typeOfDiscount;
    method;
    startDate;
    startTime;
    endDate;
    endTime;
    discountPercentage;
    totalUsage;
    usedBy;
    constructor(typeOfDiscount) {
        this.name = '';
        this.typeOfDiscount = typeOfDiscount;
        this.method = 'FLASHSALE';
        this.startDate = '';
        this.startTime = '';
        this.endDate = '';
        this.endTime = '';
        this.discountPercentage = 0;
        this.totalUsage = 0;
        this.usedBy = [];
    }
    // Getters
    getName() {
        return this.name;
    }
    getTypeOfDiscount() {
        return this.typeOfDiscount;
    }
    getMethod() {
        return this.method;
    }
    getStartDate() {
        return this.startDate;
    }
    getStartTime() {
        return this.startTime;
    }
    getEndDate() {
        return this.endDate;
    }
    getEndTime() {
        return this.endTime;
    }
    getDiscountPercentage() {
        return this.discountPercentage;
    }
    getTotalUsage() {
        return this.totalUsage;
    }
    getUsedBy() {
        return this.usedBy;
    }
    // Setters
    setName(name) {
        this.name = name;
    }
    setTypeOfDiscount(typeOfDiscount) {
        this.typeOfDiscount = typeOfDiscount;
    }
    setStartDate(startDate) {
        this.startDate = startDate;
    }
    setStartTime(startTime) {
        this.startTime = startTime;
    }
    setEndDate(endDate) {
        this.endDate = endDate;
    }
    setEndTime(endTime) {
        this.endTime = endTime;
    }
    setDiscountPercentage(discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    setTotalUsage(totalUsage) {
        this.totalUsage = totalUsage;
    }
    setUsedBy(userId) {
        this.usedBy.push(userId);
    }
}
exports.FlashSale = FlashSale;
//# sourceMappingURL=Offer.js.map