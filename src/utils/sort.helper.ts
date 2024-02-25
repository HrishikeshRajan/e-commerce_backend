import mongoose from "mongoose"

type m = -1 | 1 | mongoose.Expression.Meta
type field = Record<string, m>

export const SortMap: Record<string, field> = {
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

  }
