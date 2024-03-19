import { getTax } from './tax.util';

export class CartPrice {
  private productTax: number;

  constructor(private productTotalPrice:number) {
    this.productTax = Number(getTax(this.productTotalPrice));
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
