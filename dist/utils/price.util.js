"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPrice = void 0;
const tax_util_1 = require("./tax.util");
class CartPrice {
    productTotalPrice;
    productTax;
    constructor(productTotalPrice) {
        this.productTotalPrice = productTotalPrice;
        this.productTax = Number((0, tax_util_1.getTax)(this.productTotalPrice));
    }
    getMRP() {
        return this.getInitialPrice() + this.productTax;
    }
    getInitialPrice() {
        return Number((this.productTotalPrice));
    }
    getTaxAmount() {
        return this.productTax;
    }
}
exports.CartPrice = CartPrice;
//# sourceMappingURL=price.util.js.map