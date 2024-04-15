"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortMap = void 0;
exports.SortMap = {
    "orderId": { "order.orderId": 1 },
    "-orderId": { "order.orderId": -1 },
    "orderDate": { "order.orderDate": 1 },
    "-orderDate": { "order.orderDate": -1 },
    "fullname": { 'order.customerId.fullname': 1 },
    "-fullname": { 'order.customerId.fullname': -1 },
    "productName": { 'order.product.name': 1 },
    "-productName": { 'order.product.name': -1 },
    "qty": { 'order.qty': 1 },
    "-qty": { 'order.qty': -1 },
    "stock": { 'order.product.stock': 1 },
    "-stock": { 'order.product.stock': -1 },
    "unitPrice": { 'order.unitPrice': 1 },
    "-unitPrice": { 'order.unitPrice': -1 },
    "taxAmount": { 'order.taxAmount': 1 },
    "-taxAmount": { 'order.taxAmount': -1 },
    "totalPriceAfterTax": { 'order.totalPriceAfterTax': 1 },
    "-totalPriceAfterTax": { 'order.totalPriceAfterTax': -1 },
    "productPrice": { 'order.product.price': 1 },
    "-productPrice": { 'order.product.price': -1 }
};
//# sourceMappingURL=sort.helper.js.map